// components/payments/PricingPlans.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { loadRazorpayScript, createPaymentOrder, verifyPayment } from '@/lib/payments/razorpay';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';

const features = {
  free: [
    'Access to basic courses',
    'Limited flashcards (50 cards)',
    'Basic mock tests (5 per month)',
    'Community support',
    'Basic study materials',
  ],
  premium: [
    'All premium courses',
    'Unlimited flashcards',
    'All mock tests with detailed analysis',
    'Previous year questions (PYQs)',
    'AI-powered spaced repetition',
    'Video lectures with notes',
    'Priority support',
    'Offline content download',
    'Performance analytics',
    'Expert mentorship sessions',
  ],
};

export default function PricingPlans() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const router = useRouter();

  const handleUpgrade = async (planType: 'monthly' | 'yearly') => {
    if (!user) {
      router.push('/login');
      return;
    }

    setLoading(planType);
    setError('');

    try {
      // Load Razorpay script
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error('Failed to load payment gateway');
      }

      const amount = planType === 'monthly' ? 299 : 2999;
      const order = await createPaymentOrder(amount, planType);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: order.amount,
        currency: order.currency,
        name: 'Kanchen Academy',
        description: `${planType === 'monthly' ? 'Monthly' : 'Yearly'} Premium Subscription`,
        order_id: order.id,
        handler: async (response: any) => {
          try {
            await verifyPayment(
              response.razorpay_payment_id,
              response.razorpay_order_id,
              response.razorpay_signature,
              planType
            );
            
            // Redirect to success page
            router.push('/dashboard?upgraded=true');
          } catch (error: any) {
            setError('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user.full_name || '',
          email: user.email,
          contact: '',
        },
        notes: {
          user_id: user.id,
          plan_type: planType,
        },
        theme: {
          color: '#3B82F6',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Unlock your potential with our comprehensive learning platform designed for competitive exam success
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6 max-w-md mx-auto">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Free Plan */}
        <Card className="relative">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Free
              <Badge variant="secondary">Current</Badge>
            </CardTitle>
            <div className="mt-4">
              <span className="text-3xl font-bold">₹0</span>
              <span className="text-gray-600">/month</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              {features.free.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-3" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            <Button className="w-full" variant="outline" disabled>
              Current Plan
            </Button>
          </CardContent>
        </Card>

        {/* Monthly Premium Plan */}
        <Card className="relative border-blue-200 bg-blue-50">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-blue-600 text-white">
              <Star className="h-3 w-3 mr-1" />
              Popular
            </Badge>
          </div>
          <CardHeader>
            <CardTitle className="text-blue-600">Premium Monthly</CardTitle>
            <div className="mt-4">
              <span className="text-3xl font-bold">₹299</span>
              <span className="text-gray-600">/month</span>
            </div>
            <p className="text-sm text-gray-600">Perfect for focused preparation</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              {features.premium.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check className="h-4 w-4 text-blue-600 mr-3" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700" 
              onClick={() => handleUpgrade('monthly')}
              disabled={loading === 'monthly'}
            >
              {loading === 'monthly' ? 'Processing...' : 'Upgrade to Monthly'}
            </Button>
          </CardContent>
        </Card>

        {/* Yearly Premium Plan */}
        <Card className="relative border-green-200 bg-green-50">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-green-600 text-white">
              <Zap className="h-3 w-3 mr-1" />
              Best Value
            </Badge>
          </div>
          <CardHeader>
            <CardTitle className="text-green-600">Premium Yearly</CardTitle>
            <div className="mt-4">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">₹2,999</span>
                <span className="text-gray-600">/year</span>
              </div>
              <div className="text-sm text-green-600 font-medium mt-1">
                Save ₹588 (17% off)
              </div>
            </div>
            <p className="text-sm text-gray-600">Best for comprehensive exam prep</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              {features.premium.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-3" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            <Button 
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={() => handleUpgrade('yearly')}
              disabled={loading === 'yearly'}
            >
              {loading === 'yearly' ? 'Processing...' : 'Upgrade to Yearly'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <div className="mt-16 max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h3>
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-2">Can I cancel my subscription anytime?</h4>
            <p className="text-gray-600">Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period.</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">What payment methods do you accept?</h4>
            <p className="text-gray-600">We accept all major credit/debit cards, net banking, UPI, and digital wallets through Razorpay.</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Is there a money-back guarantee?</h4>
            <p className="text-gray-600">Yes, we offer a 7-day money-back guarantee if you're not satisfied with our premium features.</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Can I switch between monthly and yearly plans?</h4>
            <p className="text-gray-600">Yes, you can upgrade or change your plan at any time. The pricing will be adjusted accordingly.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
