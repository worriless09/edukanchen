// app/api/payments/create-order/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import crypto from 'crypto';

const razorpay = {
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_SECRET!,
};

export async function POST(request: NextRequest) {
  try {
    const { amount, planType } = await request.json();
    
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create order with Razorpay
    const orderOptions = {
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `receipt_${user.id}_${Date.now()}`,
      notes: {
        user_id: user.id,
        plan_type: planType,
      },
    };

    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${razorpay.key_id}:${razorpay.key_secret}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderOptions),
    });

    const order = await response.json();

    if (!response.ok) {
      throw new Error(order.error?.description || 'Failed to create order');
    }

    return NextResponse.json(order);
  } catch (error: any) {
    console.error('Error creating payment order:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}