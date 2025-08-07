'use client';
import React, { useState } from 'react';

interface PaymentFormProps {
  planId: string;
  amount: number;
  user: {
    name: string;
    email: string;
    phone?: string;
  };
}

// Razorpay type definitions
interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  method: {
    upi: boolean;
    card: boolean;
    netbanking: boolean;
    wallet: boolean;
  };
  modal: {
    ondismiss: () => void;
  };
}

interface RazorpayInstance {
  open: () => void;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

const RAZORPAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

if (!RAZORPAY_KEY) {
  console.error('NEXT_PUBLIC_RAZORPAY_KEY_ID is not configured');
}


export default function PaymentForm({ planId, amount, user }: PaymentFormProps) {
  const [loading, setLoading] = useState(false);

  const createPaymentOrder = async (amount: number, planId: string) => {
    const response = await fetch('/api/payments/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, planId }),
    });

    if (!response.ok) {
      throw new Error('Failed to create order');
    }

    return await response.json();
  };

  const verifyPayment = async (response: RazorpayResponse) => {
    const verifyResponse = await fetch('/api/payments/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
      }),
    });

    if (!verifyResponse.ok) {
      throw new Error('Payment verification failed');
    }

    return await verifyResponse.json();
  };

  const handlePayment = async () => {
    try {
      setLoading(true);

       // Validate Razorpay key
    const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    if (!razorpayKey) {
      console.error('Razorpay key not configured');
      alert('Payment configuration error. Please contact support.');
      setLoading(false);
      return;
    }
      
      // Check if Razorpay script is loaded
      if (!window.Razorpay) {
        alert('Razorpay SDK not loaded. Please refresh the page.');
        setLoading(false);
        return;
      }

      const order = await createPaymentOrder(amount, planId);
      
      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency,
        name: 'Kanchen Academy',
        description: 'Premium Subscription',
        order_id: order.id,
        handler: async (response: RazorpayResponse) => {
          try {
            const verificationResult = await verifyPayment(response);
            if (verificationResult.success) {
              alert('Payment successful! Your subscription is now active.');
              // Redirect or update UI
              window.location.reload();
            }
          } catch (error) {
            console.error('Verification error:', error);
            alert('Payment verification failed. Please contact support.');
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone || '',
        },
        theme: {
          color: '#3B82F6',
        },
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true,
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to initiate payment. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="payment-form">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Complete Your Payment</h3>
        <div className="mb-4">
          <p className="text-gray-600">Plan: Premium Subscription</p>
          <p className="text-2xl font-bold text-blue-600">₹{amount}</p>
        </div>
        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </div>
    </div>
  );
}