import { NextRequest, NextResponse } from "next/server";
import { verifyIssuer, getCurrentUserData } from "@/utils/authService";

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated and is an admin
    const currentUser = await getCurrentUserData();
    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized: You must be logged in" },
        { status: 401 }
      );
    }
    
    if (currentUser.role !== 'admin') {
      return NextResponse.json(
        { error: "Forbidden: Only admins can verify issuers" },
        { status: 403 }
      );
    }
    
    const data = await request.json();
    const { issuerId, verify } = data;
    
    if (!issuerId) {
      return NextResponse.json(
        { error: "Missing issuer ID" },
        { status: 400 }
      );
    }
    
    // Verify or unverify the issuer
    await verifyIssuer(issuerId, verify !== false);
    
    return NextResponse.json({ 
      success: true, 
      message: verify !== false ? "Issuer verified successfully" : "Issuer verification revoked"
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 