import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/app/utils/mongodb";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dbj8h56jj",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ProductSchema = new mongoose.Schema({
  product_id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  short_description: { type: String, required: true },
  description: { type: String, required: true },
  license_type: { type: String, enum: ["student", "commercial"], required: true },
  student_price: { type: Number, required: true, min: 0 },
  commercial_price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true },
  tags: { type: String },
  featured: { type: Boolean, default: false },
  main_image: { type: String },
  images: { type: [String], required: true },
}, { timestamps: true });
const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

// Check and fix duplicate product IDs on startup
const checkAndFixDuplicates = async () => {
  try {
    const duplicates = await Product.aggregate([
      { $group: { _id: "$product_id", count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } }
    ]);
    
    if (duplicates.length > 0) {
      console.log(`Found ${duplicates.length} duplicate product IDs, fixing...`);
      
      for (const dup of duplicates) {
        const products = await Product.find({ product_id: dup._id }).sort({ createdAt: 1 });
        
        // Keep the first product, update others with new IDs
        for (let i = 1; i < products.length; i++) {
          const newId = `${dup._id}-${Date.now()}-${i}`;
          await Product.findByIdAndUpdate(products[i]._id, { product_id: newId });
          console.log(`Updated product ${products[i]._id} with new ID: ${newId}`);
        }
      }
    }
  } catch (error) {
    console.error("Error checking/fixing duplicates:", error);
  }
};

// Run the check when the module loads
checkAndFixDuplicates();

export async function GET(req) {
  const maxRetries = 3;
  let retries = 0;
  const { searchParams } = new URL(req.url);
  const featuredOnly = searchParams.get('featured') === 'true';

  while (retries < maxRetries) {
    try {
      await connectToDatabase();
      let query = {};
      if (featuredOnly) {
        query.featured = true;
      }
      const products = await Product.find(query).sort({ createdAt: -1 }).lean();
      console.log(`GET /api/products: Found ${products.length} products`);
      if (products.length > 0) {
        console.log("Sample product:", {
          id: products[0]._id,
          title: products[0].title,
          main_image: products[0].main_image,
          images_count: products[0].images?.length || 0
        });
        console.log("Full sample product data:", JSON.stringify(products[0], null, 2));
      } else {
        console.log("No products found in database");
      }
      return NextResponse.json({ success: true, data: products });
    } catch (error) {
      retries++;
      console.error(`GET /api/products attempt ${retries} failed:`, error);
      if (retries === maxRetries) {
        return NextResponse.json({ success: false, message: `Failed to fetch products: ${error.message}` }, { status: 500 });
      }
      await new Promise(resolve => setTimeout(resolve, 2000 * retries));
    }
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();
    const data = await req.json();
    if (!data.product_id || !data.title || !data.slug || !data.category) {
      return NextResponse.json({ success: false, message: "Required fields are missing" }, { status: 400 });
    }
    
    // Ensure images array exists (can be empty initially)
    if (!data.images) {
      data.images = [];
    }
    
    // Check for duplicate slug
    const existsBySlug = await Product.findOne({ slug: data.slug });
    if (existsBySlug) {
      return NextResponse.json({ success: false, message: "Product with this slug already exists" }, { status: 400 });
    }
    
    // Check for duplicate product_id
    const existsById = await Product.findOne({ product_id: data.product_id });
    if (existsById) {
      return NextResponse.json({ success: false, message: "Product with this ID already exists" }, { status: 400 });
    }
    
    const product = new Product(data);
    await product.save();
    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("POST /api/products error:", error);
    
    // Handle MongoDB duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const message = field === 'product_id' 
        ? "Product ID already exists" 
        : field === 'slug' 
        ? "Product slug already exists" 
        : "Duplicate field value";
      return NextResponse.json({ success: false, message }, { status: 400 });
    }
    
    return NextResponse.json({ success: false, message: `Failed to create product: ${error.message}` }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectToDatabase();
    const data = await req.json();
    if (!data._id) {
      return NextResponse.json({ success: false, message: "Product ID is required" }, { status: 400 });
    }
    const updated = await Product.findByIdAndUpdate(data._id, data, { new: true, runValidators: true });
    if (!updated) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    console.error("PUT /api/products error:", error);
    
    // Handle MongoDB duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const message = field === 'product_id' 
        ? "Product ID already exists" 
        : field === 'slug' 
        ? "Product slug already exists" 
        : "Duplicate field value";
      return NextResponse.json({ success: false, message }, { status: 400 });
    }
    
    return NextResponse.json({ success: false, message: `Failed to update product: ${error.message}` }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, message: "Product ID is required" }, { status: 400 });
    }
    // Find the product to get its images
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }
    
    // Delete images from Cloudinary if they exist
    if (product.images && product.images.length > 0) {
      for (const imageUrl of product.images) {
        try {
          const publicId = imageUrl.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(publicId);
        } catch (error) {
          console.error("Failed to delete image from Cloudinary:", error);
        }
      }
    }
    
    await Product.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/products error:", error);
    return NextResponse.json({ success: false, message: `Failed to delete product: ${error.message}` }, { status: 500 });
  }
}

// PATCH method to manually trigger duplicate checking and fixing
export async function PATCH(req) {
  try {
    await connectToDatabase();
    const { action } = await req.json();
    
    if (action === "check-duplicates") {
      const duplicates = await Product.aggregate([
        { $group: { _id: "$product_id", count: { $sum: 1 } } },
        { $match: { count: { $gt: 1 } } }
      ]);
      
      if (duplicates.length > 0) {
        console.log(`Found ${duplicates.length} duplicate product IDs, fixing...`);
        
        for (const dup of duplicates) {
          const products = await Product.find({ product_id: dup._id }).sort({ createdAt: 1 });
          
          // Keep the first product, update others with new IDs
          for (let i = 1; i < products.length; i++) {
            const newId = `${dup._id}-${Date.now()}-${i}`;
            await Product.findByIdAndUpdate(products[i]._id, { product_id: newId });
            console.log(`Updated product ${products[i]._id} with new ID: ${newId}`);
          }
        }
        
        return NextResponse.json({ 
          success: true, 
          message: `Fixed ${duplicates.length} duplicate product IDs`,
          duplicates: duplicates.length
        });
      } else {
        return NextResponse.json({ 
          success: true, 
          message: "No duplicate product IDs found",
          duplicates: 0
        });
      }
    }
    
    return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("PATCH /api/products error:", error);
    return NextResponse.json({ success: false, message: `Failed to process request: ${error.message}` }, { status: 500 });
  }
}