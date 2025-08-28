// app/(auth)/register/page.tsx
import RegisterForm from '@/components/auth/RegisterForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Account - Kanchen Academy',
  description: 'Create your Kanchen Academy account and start your competitive exam preparation.',
};

export default function RegisterPage() {
  return <RegisterForm />;
}