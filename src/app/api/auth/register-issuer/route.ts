import { NextRequest, NextResponse } from "next/server";
import { registerIssuer } from "@/utils/authService";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { email, password, displayName, organization, walletAddress } = data;
    
    if (!email || !password || !displayName || !organization || !walletAddress) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    const user = await registerIssuer(email, password, displayName, organization, walletAddress);
    
    return NextResponse.json({ 
      success: true, 
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        organization: user.organization,
        isVerified: user.isVerified
      },
      message: "Registration successful. Your account requires admin approval before you can verify credentials."
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 