// app/api/payments/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      plan_type,
    } = await request.json();

    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify signature
    const secret = process.env.RAZORPAY_SECRET!;
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Calculate subscription dates
    const now = new Date();
    const expiresAt = new Date(now);
    
    if (plan_type === 'monthly') {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    } else {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    }

    // Save subscription to database
    const { error: subscriptionError } = await supabase
      .from('user_subscriptions')
      .insert({
        user_id: user.id,
        plan_type,
        amount: plan_type === 'monthly' ? 299 : 2999,
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        status: 'active',
        starts_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
      });

    if (subscriptionError) throw subscriptionError;

    // Update user profile
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        subscription_tier: 'premium',
        subscription_expires_at: expiresAt.toISOString(),
      })
      .eq('id', user.id);

    if (profileError) throw profileError;

    return NextResponse.json({ 
      success: true,
      subscription_expires_at: expiresAt.toISOString(),
    });
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
