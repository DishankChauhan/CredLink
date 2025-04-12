import { NextRequest, NextResponse } from "next/server";
import { getPendingCredentialsForIssuer } from "@/utils/credentialService";
import { getCurrentUserData } from "@/utils/authService";

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated and is an issuer
    const currentUser = await getCurrentUserData();
    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized: You must be logged in to view pending credentials" },
        { status: 401 }
      );
    }
    
    if (currentUser.role !== 'issuer') {
      return NextResponse.json(
        { error: "Forbidden: Only issuers can access pending credentials" },
        { status: 403 }
      );
    }
    
    // Get pending credentials for the issuer's organization
    const pendingCredentials = await getPendingCredentialsForIssuer(currentUser.uid);
    
    return NextResponse.json({ 
      success: true, 
      pendingCredentials
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 