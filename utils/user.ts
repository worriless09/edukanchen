// utils/user.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database, UserProfile } from '@/types/user'

export const supabase = createClientComponentClient<Database>()

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching user profile:', error)
    return null
  }

  return data
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error updating user profile:', error)
    return null
  }

  return data
}

export async function upgradeToPremium(userId: string, expiresAt?: Date) {
  return updateUserProfile(userId, {
    subscription_status: 'premium',
    subscription_expires_at: expiresAt?.toISOString() || null
  })
}

export function getDisplayName(profile: UserProfile): string {
  return profile.full_name || profile.email?.split('@')[0] || 'User'
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}