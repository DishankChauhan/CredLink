import { NextRequest, NextResponse } from "next/server";
import { verifyCredential } from "@/utils/credentialService";
import { getCurrentUserData } from "@/utils/authService";

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated and is an issuer
    const currentUser = await getCurrentUserData();
    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized: You must be logged in to verify a credential" },
        { status: 401 }
      );
    }
    
    if (currentUser.role !== 'issuer') {
      return NextResponse.json(
        { error: "Forbidden: Only issuers can verify credentials" },
        { status: 403 }
      );
    }
    
    if (!currentUser.isVerified) {
      return NextResponse.json(
        { error: "Forbidden: Your issuer account is pending approval by an admin" },
        { status: 403 }
      );
    }
    
    const data = await request.json();
    const { credentialId } = data;
    
    if (!credentialId) {
      return NextResponse.json(
        { error: "Missing credential ID" },
        { status: 400 }
      );
    }
    
    // Verify the credential
    const credential = await verifyCredential(credentialId, currentUser.uid);
    
    return NextResponse.json({ 
      success: true, 
      credential,
      message: "Credential has been successfully verified and recorded on the blockchain"
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 