import { NextResponse } from 'next/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export function GET() {
  return NextResponse.json({
    ok: true,
    service: 'alpha-weber-crm',
    supabaseConfigured: isSupabaseConfigured,
  });
}
