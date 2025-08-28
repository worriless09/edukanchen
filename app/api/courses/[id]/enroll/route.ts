// app/api/courses/[id]/enroll/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: courseId } = params;
    
    // Validate course exists
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id, title, price, tier')
      .eq('id', courseId)
      .single();

    if (courseError || !course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Check if user is already enrolled
    const { data: existingEnrollment } = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .single();

    if (existingEnrollment) {
      return NextResponse.json({ 
        message: 'Already enrolled in this course',
        enrollment: existingEnrollment 
      });
    }

    // For premium courses, check if user has subscription or payment
    if (course.tier === 'premium') {
      const { data: subscription } = await supabase
        .from('user_subscriptions')
        .select('id, status, expires_at')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      if (!subscription || new Date(subscription.expires_at) < new Date()) {
        return NextResponse.json({ 
          error: 'Premium subscription required',
          requiresPayment: true,
          course: {
            id: course.id,
            title: course.title,
            price: course.price
          }
        }, { status: 402 });
      }
    }

    // Create enrollment
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('enrollments')
      .insert([
        {
          user_id: user.id,
          course_id: courseId,
          enrolled_at: new Date().toISOString(),
          status: 'active'
        }
      ])
      .select()
      .single();

    if (enrollmentError) {
      console.error('Enrollment error:', enrollmentError);
      return NextResponse.json({ error: 'Failed to enroll in course' }, { status: 500 });
    }

    // Update course enrollment count
    await supabase.rpc('increment_course_enrollments', { course_id: courseId });

    return NextResponse.json({
      message: 'Successfully enrolled in course',
      enrollment,
      course: {
        id: course.id,
        title: course.title
      }
    });

  } catch (error) {
    console.error('Enrollment API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: courseId } = params;

    // Delete enrollment
    const { error: deleteError } = await supabase
      .from('enrollments')
      .delete()
      .eq('user_id', user.id)
      .eq('course_id', courseId);

    if (deleteError) {
      console.error('Unenrollment error:', deleteError);
      return NextResponse.json({ error: 'Failed to unenroll from course' }, { status: 500 });
    }

    // Update course enrollment count
    await supabase.rpc('decrement_course_enrollments', { course_id: courseId });

    return NextResponse.json({
      message: 'Successfully unenrolled from course'
    });

  } catch (error) {
    console.error('Unenrollment API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: courseId } = params;

    // Check enrollment status
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('enrollments')
      .select(`
        id,
        enrolled_at,
        status,
        courses (
          id,
          title,
          description,
          tier
        )
      `)
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .single();

    if (enrollmentError && enrollmentError.code !== 'PGRST116') {
      console.error('Enrollment check error:', enrollmentError);
      return NextResponse.json({ error: 'Failed to check enrollment status' }, { status: 500 });
    }

    return NextResponse.json({
      isEnrolled: !!enrollment,
      enrollment: enrollment || null
    });

  } catch (error) {
    console.error('Enrollment status API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}