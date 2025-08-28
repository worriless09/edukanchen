// types/auth.ts
export interface User {
  id: string;
  email: string;
  full_name?: string;
  subscription_tier: 'free' | 'premium';
  subscription_expires_at?: string;
}