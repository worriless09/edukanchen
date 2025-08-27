// hooks/useSubscription.js
import { useState, useEffect } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { supabase } from '@/lib/supabase';

export function useSubscription() {
  const user = useUser();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSubscription();
    }
  }, [user]);

  const fetchSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('subscription_tier, subscription_expires_at')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      const isActive = data.subscription_expires_at 
        ? new Date(data.subscription_expires_at) > new Date()
        : false;

      setSubscription({
        tier: data.subscription_tier,
        isActive,
        expiresAt: data.subscription_expires_at
      });
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const isPremium = () => {
    return subscription?.tier === 'premium' && subscription?.isActive;
  };

  const canAccess = (contentType) => {
    if (contentType === 'free') return true;
    return isPremium();
  };

  return {
    subscription,
    loading,
    isPremium: isPremium(),
    canAccess,
    refetch: fetchSubscription
  };
}