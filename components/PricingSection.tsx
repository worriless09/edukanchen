import React, { useState } from 'react';
import { RazorpayOptions, RazorpayPaymentResponse, OrderResponse, PaymentVerificationRequest } from '@/types/razorpay';

// Component type definitions
interface Plan {
  id: string;
  name: string;
  price: number;
  duration: string;
  popular?: boolean;
  features: string[];
}

interface User {
  email: string;
  user_metadata: {
    full_name: string;
  };
  phone?: string;
}

interface PricingCardProps {
  plan: Plan;
  onUpgrade: () => void;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan, onUpgrade }) => {
  const [loading, setLoading] = useState<boolean>(false);
  
  // Mock user data - replace with actual user context from your auth system
  const user: User = {
    email: 'user@example.com',
    user_metadata: {
      full_name: 'John Doe'
    },
    phone: '+919876543210'
  };

  const handlePayment = async (): Promise<void> => {
    setLoading(true);
    try {
      // Create order on backend
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: plan.price * 100, // Razorpay expects amount in paisa
          planId: plan.id 
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const orderData: OrderResponse = await response.json();
      
      // Check if Razorpay is loaded
      if (!window.Razorpay) {
        throw new Error('Razorpay SDK not loaded. Please make sure to include the Razorpay script.');
      }

      // Get Razorpay key from environment
      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!razorpayKey) {
        throw new Error('Razorpay key not configured');
      }
      
      // Create Razorpay options using proper types
      const options: RazorpayOptions = {
        key: razorpayKey,
        amount: plan.price * 100,
        currency: 'INR',
        name: 'Kanchen Academy',
        description: `${plan.name} Subscription`,
        order_id: orderData.orderId,
        handler: async (response: RazorpayPaymentResponse): Promise<void> => {
          try {
            // Verify payment on backend
            const verificationData: PaymentVerificationRequest = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              planId: plan.id
            };

            const verifyResponse = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(verificationData)
            });
            
            if (verifyResponse.ok) {
              onUpgrade();
              alert('Payment successful! Your premium access is now active.');
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user.user_metadata.full_name,
          email: user.email,
          contact: user.phone || '+919876543210'
        },
        theme: {
          color: '#3B82F6'
        },
        modal: {
          ondismiss: () => {
            console.log('Payment modal closed');
            setLoading(false);
          }
        }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment initialization failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-blue-100 hover:border-blue-300 transition-all">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
        <div className="mt-4">
          <span className="text-4xl font-bold text-blue-600">₹{plan.price}</span>
          <span className="text-gray-500">/{plan.duration}</span>
        </div>
        
        <ul className="mt-6 space-y-4">
          {plan.features.map((feature: string, index: number) => (
            <li key={index} className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
        
        <button
          onClick={handlePayment}
          disabled={loading}
          className="mt-8 w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {loading ? 'Processing...' : `Upgrade to ${plan.name}`}
        </button>
      </div>
    </div>
  );
};

const PricingSection: React.FC = () => {
  const plans: Plan[] = [
    {
      id: 'monthly',
      name: 'Premium Monthly',
      price: 299,
      duration: 'month',
      features: [
        'Unlimited video lectures',
        'All premium courses',
        'Mock test series',
        'AI-powered flashcards',
        'Personal study planner',
        'Doubt resolution',
        'Progress analytics'
      ]
    },
    {
      id: 'yearly',
      name: 'Premium Yearly',
      price: 2999,
      duration: 'year',
      popular: true,
      features: [
        'Everything in Monthly',
        '2 months free',
        'Priority support',
        'Exclusive masterclasses',
        'Interview preparation',
        'Current affairs updates',
        'One-on-one mentoring'
      ]
    }
  ];

  const handleUpgrade = (): void => {
    // In a real app, you might want to:
    // 1. Refresh user data from your auth provider (Supabase)
    // 2. Update the UI to reflect premium status
    // 3. Redirect to a success page
    // 4. Show a success notification
    window.location.reload();
  };

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Choose Your Plan</h2>
          <p className="mt-4 text-lg text-gray-600">
            Unlock your potential with our comprehensive UPSC, SSC & Banking preparation programs
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {plans.map((plan: Plan) => (
            <div key={plan.id} className="relative">
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              <PricingCard 
                plan={plan} 
                onUpgrade={handleUpgrade} 
              />
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 inline-block">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Free Plan Features</h3>
            <ul className="text-green-700 space-y-1">
              <li>• 5 free video lectures per month</li>
              <li>• Basic study materials</li>
              <li>• Limited quiz attempts</li>
              <li>• Community access</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingSection;