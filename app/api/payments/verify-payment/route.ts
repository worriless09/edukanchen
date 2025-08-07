import { NextRequest, NextResponse } from 'next/server';
import { paymentService } from '@/lib/services/payment-service';

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();
    
    const isValid = await paymentService.verifyPayment(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (isValid) {
      // Update user subscription in database here
      return NextResponse.json({ success: true, message: 'Payment verified' });
    } else {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }
  } catch (error) {
    console.error('Payment verification failed:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}