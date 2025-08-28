// 10. PAYMENT & SUBSCRIPTION SYSTEM (RAZORPAY)
// ========================================

// lib/payments/razorpay.ts
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: any) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes: Record<string, string>;
  theme: {
    color: string;
  };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
      close: () => void;
    };
  }
}

export interface PaymentOrder {
  id: string;
  amount: number;
  currency: string;
  status: string;
}

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const createPaymentOrder = async (amount: number, planType: 'monthly' | 'yearly'): Promise<PaymentOrder> => {
  const response = await fetch('/api/payments/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, planType }),
  });

  if (!response.ok) {
    throw new Error('Failed to create payment order');
  }

  return response.json();
};

export const verifyPayment = async (
  razorpayPaymentId: string,
  razorpayOrderId: string,
  razorpaySignature: string,
  planType: 'monthly' | 'yearly'
) => {
  const response = await fetch('/api/payments/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      razorpay_payment_id: razorpayPaymentId,
      razorpay_order_id: razorpayOrderId,
      razorpay_signature: razorpaySignature,
      plan_type: planType,
    }),
  });

  if (!response.ok) {
    throw new Error('Payment verification failed');
  }

  return response.json();
};
