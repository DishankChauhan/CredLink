import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "@/utils/authService";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { email, password, displayName, walletAddress } = data;
    
    if (!email || !password || !displayName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    const user = await registerUser(email, password, displayName, walletAddress);
    
    return NextResponse.json({ 
      success: true, 
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role: user.role
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 