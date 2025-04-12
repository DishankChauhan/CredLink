import { NextRequest, NextResponse } from "next/server";
import { verifyCredentialByCredentialId } from "@/utils/credentialService";

// This is a public API endpoint for verifying credentials
export async function GET(request: NextRequest) {
  try {
    // Get the credential ID from the query string
    const credentialId = request.nextUrl.searchParams.get('id');
    
    if (!credentialId) {
      return NextResponse.json(
        { error: "Missing credential ID" },
        { status: 400 }
      );
    }
    
    // Verify the credential
    const result = await verifyCredentialByCredentialId(credentialId);
    
    if (!result.isValid) {
      return NextResponse.json({ 
        success: false,
        isValid: false,
        message: "This credential could not be verified"
      });
    }
    
    return NextResponse.json({ 
      success: true,
      isValid: true,
      credential: result.credential
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 