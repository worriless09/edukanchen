import { NextRequest, NextResponse } from 'next/server';
import { paymentService } from '@/lib/services/payment-service';

export async function POST(req: NextRequest) {
  try {
    const { amount } = await req.json();
    
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const order = await paymentService.createOrder(amount);
    return NextResponse.json(order);
  } catch (error) {
    console.error('Payment order creation failed:', error);
    return NextResponse.json({ error: 'Order creation failed' }, { status: 500 });
  }
}