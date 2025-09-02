// types/user.ts
export interface UserProfile {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  subscription_status: 'free' | 'premium'
  subscription_expires_at: string | null
  created_at: string
  updated_at: string
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: UserProfile
        Insert: Omit<UserProfile, 'created_at' | 'updated_at'> & {
          created_at?: string
          updated_at?: string
        }
        Update: Partial<UserProfile>
      }
    }
  }
}
