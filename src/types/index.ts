import { UserData, UserRole } from '@/utils/authService';
import { CredentialMetadata, CredentialType, CredentialStatus } from '@/utils/credentialService';

// Re-export types
export type { 
  UserData, 
  UserRole,
  CredentialMetadata,
  CredentialType, 
  CredentialStatus
};

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  error?: string;
  message?: string;
  data?: T;
}

export interface AuthResponse extends ApiResponse {
  user?: Partial<UserData>;
  token?: string;
}

export interface CredentialResponse extends ApiResponse {
  credential?: CredentialMetadata;
}

export interface CredentialsListResponse extends ApiResponse {
  credentials?: CredentialMetadata[];
}

export interface CredentialValidationResponse extends ApiResponse {
  isValid: boolean;
  credential?: CredentialMetadata;
} 