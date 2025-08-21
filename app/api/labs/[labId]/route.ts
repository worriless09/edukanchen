// app/api/labs/[labId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

interface Context {
  params: { labId: string };
}

export async function GET(request: NextRequest, { params }: Context) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { data: lab, error } = await supabase
      .from('labs')
      .select('*')
      .eq('id', params.labId)
      .single();

    if (error || !lab) {
      return NextResponse.json(
        { error: 'Lab not found' },
        { status: 404 }
      );
    }

    // Check if user has access (public labs or owned labs)
    if (!lab.is_public) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || lab.creator_id !== user.id) {
        return NextResponse.json(
          { error: 'Access denied' },
          { status: 403 }
        );
      }
    }

    return NextResponse.json({ lab });
  } catch (error) {
    console.error('Error fetching lab:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lab' },
      { status: 500 }
    );
  }
}