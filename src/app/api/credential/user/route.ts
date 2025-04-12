import { NextRequest, NextResponse } from "next/server";
import { getUserCredentials } from "@/utils/credentialService";
import { getCurrentUserData } from "@/utils/authService";

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const currentUser = await getCurrentUserData();
    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized: You must be logged in to view credentials" },
        { status: 401 }
      );
    }
    
    // Get credentials for the current user
    const credentials = await getUserCredentials(currentUser.uid);
    
    return NextResponse.json({ 
      success: true, 
      credentials
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 