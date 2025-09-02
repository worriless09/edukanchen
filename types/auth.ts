// types/auth.ts
export interface AuthUser {
  id: string;
  email: string;
  full_name?: string;
  name?: string; // Add this for compatibility
  avatar_url?: string; // Add this
  subscription_tier: 'free' | 'premium';
  subscription_expires_at?: string;
}