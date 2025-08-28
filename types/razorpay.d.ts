// lib/types/razorpay.d.ts

// Razorpay Payment Response Interface
export interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

// Razorpay Options Interface - Generic approach to avoid conflicts
export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayPaymentResponse) => void | Promise<void>;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
  notes?: Record<string, string>;
  [key: string]: any; // Allow additional properties for different Razorpay versions
}

// Razorpay Instance Interface
export interface RazorpayInstance {
  open(): void;
  close(): void;
}

// Global Window Interface Extension
declare global {
  interface Window {
    Razorpay: {
      new (options: {
        key: string;
        amount: number;
        currency: string;
        name: string;
        description: string;
        order_id: string;
        handler: (response: any) => void;
        prefill?: {
          name?: string;
          email?: string;
          contact?: string;
        };
        theme?: {
          color?: string;
        };
        modal?: {
          ondismiss?: () => void;
        };
      }): {
        open: () => void;
        on: (event: string, handler: (response: any) => void) => void;
      };
    };
  }
}


// Order Creation Response
export interface OrderResponse {
  orderId: string;
  amount: number;
  currency: string;
}

// Payment Verification Request
export interface PaymentVerificationRequest {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  planId: string;
}

// Export to make this a module
export {};