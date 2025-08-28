// app/(auth)/login/page.tsx
import LoginForm from '@/components/auth/LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In - Kanchen Academy',
  description: 'Sign in to your Kanchen Academy account to continue your learning journey.',
};

export default function LoginPage() {
  return <LoginForm />;
}