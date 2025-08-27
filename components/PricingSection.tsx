import React, { useState } from 'react';

// Type definitions
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

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

// Use the official RazorpayOptions type
declare global {
  interface Window {
    Razorpay: any;
  }
}

const PricingCard: React.FC<PricingCardProps> = ({ plan, onUpgrade }) => {
  const [loading, setLoading] = useState<boolean>(false);

  // Mock user data - replace with actual user context
  const user: User = {
    email: 'user@example.com',
    user_metadata: { full_name: 'John Doe' },
    phone: '+919876543210',
  };

  const handlePayment = async (): Promise<void> => {
    setLoading(true);
    try {
      // Create order on backend
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: plan.price * 100,
          planId: plan.id,
        }),
      });

      const { orderId }: { orderId: string } = await response.json();

      if (!window.Razorpay) throw new Error('Razorpay SDK not loaded');
      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!razorpayKey) throw new Error('Razorpay key not configured');

      // Fully typed Razorpay options
      const options: RazorpayOptions = {
        key: razorpayKey,
        amount: plan.price * 100,
        currency: 'INR',
        name: 'Kanchen Academy',
        description: `${plan.name} Subscription`,
        order_id: orderId,
        handler: async (response: RazorpayResponse) => {
          const verifyResponse = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              planId: plan.id,
            }),
          });

          if (verifyResponse.ok) {
            onUpgrade();
            alert('Payment successful! Your premium access is now active.');
          } else {
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user.user_metadata.full_name,
          email: user.email,
          contact: user.phone || '+919876543210',
        },
        theme: { color: '#3B82F6' },
        method: 'card', // Required field by RazorpayOptions
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment initialization failed. Please try again.');
    } finally {
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
              <svg
                className="h-5 w-5 text-green-500 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
        <button
          onClick={handlePayment}
          disabled={loading}
          className="mt-8 w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Processing...' : `Upgrade to ${plan.name}`}
        </button>
      </div>
    </div>
  );
};

export default PricingCard;
