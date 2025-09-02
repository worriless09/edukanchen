// app/(dashboard)/layout.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import IntegratedDashboardLayout from '@/components/layout/IntegratedDashboardLayout';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  return <IntegratedDashboardLayout>{children}</IntegratedDashboardLayout>;
}