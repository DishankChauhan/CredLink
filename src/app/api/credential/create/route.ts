import { NextRequest, NextResponse } from "next/server";
import { createCredential } from "@/utils/credentialService";
import { getCurrentUserData } from "@/utils/authService";

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const currentUser = await getCurrentUserData();
    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized: You must be logged in to create a credential" },
        { status: 401 }
      );
    }
    
    // For multipart form data, we need to handle the file upload differently
    // This is a simplified version that doesn't handle file uploads through the API
    // For file uploads, it's better to use client-side Firebase Storage calls
    const data = await request.json();
    
    // Create credential without file
    const credential = await createCredential(data);
    
    return NextResponse.json({ 
      success: true, 
      credential
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 