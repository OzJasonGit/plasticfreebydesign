import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { connectToDatabase } from "../../utils/mongodb";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb"; 

// GET /api/header - Fetch user authentication status and details
export async function GET(req) {
  try {
    // Check if JWT_SECRET is available
    if (!process.env.JWT_SECRET) {
      console.error('API Route - JWT_SECRET environment variable is not set!');
      return NextResponse.json(
        { isAuthenticated: false, error: "Server configuration error" },
        { status: 500 }
      );
    }
    
    // Check for token in both cookies and Authorization header
    const cookieStore = cookies();
    let token = cookieStore.get("token")?.value;
    
    // If no token in cookies, check Authorization header
    if (!token) {
      const authHeader = req.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
        console.log('API Route - Token found in Authorization header');
      }
    }
    
    console.log('API Route - Received request');
    console.log('API Route - All cookies:', cookieStore.getAll());
    console.log('API Route - Token found:', token ? 'Yes' : 'No');
    console.log('API Route - Token source:', token ? (cookieStore.get("token")?.value ? 'Cookies' : 'Authorization Header') : 'None');

    if (!token) {
      // If no token is found, the user is not authenticated
      console.log('API Route - No token, returning unauthenticated');
      return NextResponse.json({ isAuthenticated: false }, { status: 200 });
    }

    // Verify the token
    let decoded;
    try {
      console.log('API Route - About to verify JWT token');
      console.log('API Route - JWT_SECRET exists:', !!process.env.JWT_SECRET);
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('API Route - JWT verification successful:', decoded);
    } catch (error) {
      console.error('API Route - JWT verification failed:', error);
      if (error.name === "TokenExpiredError") {
        return NextResponse.json({ error: "Token expired" }, { status: 401 });
      }
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    // Connect to the database
    console.log('API Route - Connecting to database...');
    const db = await connectToDatabase();
    const User = db.collection("users");
    console.log('API Route - Database connected, looking for user with ID:', decoded.id);

    // Find the user by ID (convert decoded.id to ObjectId if necessary)
    const user = await User.findOne({ _id: new ObjectId(decoded.id) });
    console.log('API Route - User lookup result:', user ? 'Found' : 'Not found');
    
    if (!user) {
      console.log('API Route - User not found in database');
      return NextResponse.json({ isAuthenticated: false }, { status: 200 });
    }

    console.log('API Route - User found, returning authenticated response');
    // Return user details (excluding sensitive data)
    return NextResponse.json(
      {
        isAuthenticated: true,
        user: {
          name:user.name,
          id: user._id,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/header:", error);
    return NextResponse.json(
      { isAuthenticated: false, error: "Something went wrong" },
      { status: 500 }
    );
  }
}

// POST /api/logout - Clear the token cookie and log the user out
export async function POST() {
  try {
    // Clear the token cookie
    const cookieStore = cookies();
    cookieStore.delete("token");

    return NextResponse.json(
      { message: "Logout successful" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/logout:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}