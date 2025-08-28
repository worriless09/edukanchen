// components/auth/AuthProvider.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User as SupabaseUser } from '@supabase/auth-helpers-nextjs';
import { User } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  hasAccess: (contentTier: 'free' | 'premium') => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          setUser({
            id: profile.id,
            email: profile.email || session.user.email || '',
            full_name: profile.full_name || '',
            subscription_tier: profile.subscription_tier,
            subscription_expires_at: profile.subscription_expires_at || undefined,
          });
        }
      }
      setLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await getUser();
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const hasAccess = (contentTier: 'free' | 'premium') => {
    if (contentTier === 'free') return true;
    if (!user) return false;
    if (user.subscription_tier === 'premium') {
      if (!user.subscription_expires_at) return true;
      return new Date(user.subscription_expires_at) > new Date();
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, hasAccess }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
