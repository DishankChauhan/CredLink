'use client';

import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';
import { getCurrentUserData } from './authService';

/**
 * Upload a file to Firebase Storage
 * @param file The file to upload
 * @param path Optional custom path (defaults to user's directory)
 * @returns Promise with the download URL
 */
export async function uploadFile(file: File, path?: string): Promise<string> {
  try {
    // Get current user
    const user = await getCurrentUserData();
    if (!user) {
      throw new Error("User must be authenticated to upload files");
    }
    
    // Generate a safe filename (replace spaces with underscores)
    const safeFileName = file.name.replace(/\s+/g, '_');
    
    // Create a unique filename with timestamp
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}-${safeFileName}`;
    
    // Use custom path or default to user's directory
    const uploadPath = path || `documents/${user.uid}`;
    const storageRef = ref(storage, `${uploadPath}/${uniqueFileName}`);
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get and return the download URL
    return await getDownloadURL(snapshot.ref);
  } catch (error: any) {
    console.error('Error uploading file:', error);
    throw new Error(`File upload failed: ${error.message}`);
  }
}

/**
 * Upload multiple files to Firebase Storage
 * @param files Array of files to upload
 * @param path Optional custom path
 * @returns Promise with array of download URLs
 */
export async function uploadMultipleFiles(files: File[], path?: string): Promise<string[]> {
  const uploadPromises = files.map(file => uploadFile(file, path));
  return Promise.all(uploadPromises);
}

/**
 * Delete a file from Firebase Storage by URL
 * @param fileUrl The URL of the file to delete
 */
export async function deleteFileByUrl(fileUrl: string): Promise<void> {
  try {
    // Extract the file path from the URL
    const fileRef = ref(storage, fileUrl);
    await deleteObject(fileRef);
  } catch (error: any) {
    console.error('Error deleting file:', error);
    throw new Error(`File deletion failed: ${error.message}`);
  }
}

/**
 * Generate unique filename for a file
 * @param file The file to generate a name for
 * @returns Unique filename
 */
export function generateUniqueFileName(file: File): string {
  const timestamp = Date.now();
  const safeFileName = file.name.replace(/\s+/g, '_');
  return `${timestamp}-${safeFileName}`;
} 