// components/payments/SubscriptionStatus.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Subscription {
  id: string;
  plan_type: 'monthly' | 'yearly';
  amount: number;
  status: 'active' | 'expired' | 'cancelled';
  starts_at: string;
  expires_at: string;
  created_at: string;
}

export default function SubscriptionStatus() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const supabase = createClient();

  useEffect(() => {
    if (user) {
      fetchSubscription();
    }
  }, [user]);

  const fetchSubscription = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') { // Not found error
        throw error;
      }

      setSubscription(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getDaysRemaining = (expiryDate: string) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return <div className="animate-pulse h-32 bg-gray-200 rounded-lg"></div>;
  }

  if (!subscription || subscription.status !== 'active') {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold">No Active Subscription</h3>
              <p className="text-gray-600">Upgrade to premium to unlock all features</p>
            </div>
            <Button>Upgrade Now</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const daysRemaining = getDaysRemaining(subscription.expires_at);
  const isExpiringSoon = daysRemaining <= 7;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Current Subscription
            <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
              {subscription.status === 'active' ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Active
                </>
              ) : (
                subscription.status
              )}
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">Plan Type</div>
              <div className="font-medium capitalize">
                {subscription.plan_type === 'monthly' ? 'Monthly Premium' : 'Yearly Premium'}
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-600">Amount Paid</div>
              <div className="font-medium">₹{subscription.amount}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600 flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                Started On
              </div>
              <div className="font-medium">{formatDate(subscription.starts_at)}</div>
            </div>
            
            <div>
              <div className="text-sm text-gray-600 flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                Expires On
              </div>
              <div className="font-medium">{formatDate(subscription.expires_at)}</div>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Days Remaining</div>
                <div className={`font-bold text-lg ${isExpiringSoon ? 'text-red-600' : 'text-green-600'}`}>
                  {daysRemaining > 0 ? daysRemaining : 0} days
                </div>
              </div>
              
              <Button variant="outline" size="sm">
                <CreditCard className="h-4 w-4 mr-2" />
                Renew Now
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {isExpiringSoon && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Your subscription expires in {daysRemaining} days. Renew now to continue enjoying premium features.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
