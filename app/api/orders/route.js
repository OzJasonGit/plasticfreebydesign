import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/utils/mongodb';
import { getCurrentUser } from '@/app/utils/auth';
import { ObjectId } from 'mongodb';

const ORDERS_COLLECTION = 'orders';

export async function GET(req) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      console.log('No user found');
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    const db = await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const month = searchParams.get('month'); // format: YYYY-MM
    const search = searchParams.get('search') || '';

    // If no search param, only admins can view all orders
    if (!search && user.role !== 1) {
      console.log('Non-admin tried to fetch all orders:', user);
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const query = {};
    if (month) {
      // Filter by month (createdAt between first and last day of month)
      const [year, monthNum] = month.split('-').map(Number);
      const start = new Date(year, monthNum - 1, 1);
      const end = new Date(year, monthNum, 1);
      query.createdAt = { $gte: start, $lt: end };
    }
    if (search) {
      let isObjectId = false;
      let objectId = null;
      if (/^[a-fA-F0-9]{24}$/.test(search)) {
        try {
          objectId = new ObjectId(search);
          isObjectId = true;
        } catch (e) {
          isObjectId = false;
        }
      }
      const regex = new RegExp(search, 'i');
      query.$or = [
        { stripeSessionId: regex },
        { paypalOrderId: regex },
        { userName: regex },
        { userEmail: regex },
        { 'products.title': regex },
      ];
      if (isObjectId) {
        query.$or.unshift({ _id: objectId });
      }
      // For non-admins, restrict to their own orders
      if (user.role !== 1) {
        query.userId = user.id.toString();
      }
    }

    console.log('User:', user);
    console.log('Search param:', search);
    console.log('Query object:', JSON.stringify(query));

    const total = await db.collection(ORDERS_COLLECTION).countDocuments(query);
    const orders = await db.collection(ORDERS_COLLECTION)
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();
    
    console.log('Orders returned:', orders);
    return NextResponse.json({ orders, total, page, limit });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const db = await connectToDatabase();
    const orderData = await req.json();
    
    const order = {
      ...orderData,
      userId: user.id.toString(),
      userEmail: user.email,
      userName: user.name,
      status: orderData.status || 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection(ORDERS_COLLECTION).insertOne(order);
    
    return NextResponse.json({ 
      success: true, 
      orderId: result.insertedId,
      order: { ...order, _id: result.insertedId }
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 

export async function PATCH(req) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Only admins can update orders
    if (user.role !== 1) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const db = await connectToDatabase();
    const { orderId, status } = await req.json();
    
    const result = await db.collection(ORDERS_COLLECTION).updateOne(
      { _id: new ObjectId(orderId) },
      { 
        $set: { 
          status: status,
          updatedAt: new Date()
        } 
      }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: 'Order status updated' });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 