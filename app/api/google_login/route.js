import { OAuth2Client } from "google-auth-library";
import { NextResponse } from "next/server";
import { connectToDatabase } from "../../utils/mongodb";
import jwt from "jsonwebtoken";

const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export async function POST(req) {
  const { token } = await req.json();
  const db = await connectToDatabase();
  const User = db.collection("users");

  try {
    // Verify Google ID token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, name, email, picture } = payload;

    // Check if the user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // If user doesn't exist, create one
      user = {
        googleId: sub,
        name,
        email,
        avatar: picture,
        role: 0, // Default role for new users
        createdAt: new Date(),
      };
      const result = await User.insertOne(user);
      user._id = result.insertedId; // Set the ID from the insert result
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      { email: user.email, id: user._id, role: user.role || 0 },
      process.env.JWT_SECRET || "test",
      { expiresIn: "7d" } // Extended to 7 days
    );

    return NextResponse.json({
      message: "User logged in successfully!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || 0,
        avatar: user.avatar
      },
      token: jwtToken,
    });
  } catch (error) {
    console.error("Google Login Error:", error);
    return NextResponse.json(
      { message: "Google Login Failedddd!" },
      { status: 500 }
    );
  }
}
