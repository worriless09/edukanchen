// app/api/labs/public/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient"; // adjust path if needed

export async function GET() {
  try {
    const { data: labs, error } = await supabase
      .from('labs')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return NextResponse.json({ 
      success: true, 
      labs: labs || [] 
    });
  } catch (error) {
    console.error('Error fetching public labs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch labs' }, 
      { status: 500 }
    );
  }
}
