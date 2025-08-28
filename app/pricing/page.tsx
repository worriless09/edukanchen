// app/pricing/page.tsx
import PricingPlans from '@/components/payments/PricingPlans';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing - Kanchen Academy',
  description: 'Choose the perfect plan for your competitive exam preparation journey.',
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PricingPlans />
      </div>
    </div>
  );
}