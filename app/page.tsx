
// app/page.tsx
import type { Metadata } from 'next'
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section" 
import { StudyMaterialsSection } from "@/components/study-materials-section"
import { FeaturesSection } from "@/components/features-section"
import { CoursesSection } from "@/components/courses-section"
import { FacultySection } from "@/components/faculty-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { FinalCtaSection } from "@/components/final-cta-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { Suspense } from 'react'

// Loading components matching your design
const SectionSkeleton = () => (
  <div className="py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
)

const HeroSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="animate-pulse">
        <div className="h-16 bg-gray-200 rounded w-3/4 mx-auto mb-6"></div>
        <div className="h-6 bg-gray-200 rounded w-2/3 mx-auto mb-8"></div>
        <div className="flex justify-center gap-4">
          <div className="h-12 bg-gray-200 rounded w-32"></div>
          <div className="h-12 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    </div>
  </div>
)

// Page component - NO children prop
export default function HomePage() {
  return (
    <>
      {/* Header */}
      <Suspense fallback={<div className="h-16 bg-white shadow-sm"></div>}>
        <Header />
      </Suspense>

      {/* Hero Section */}
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSection />
      </Suspense>

      {/* Study Materials Section */}
      <Suspense fallback={<SectionSkeleton />}>
        <StudyMaterialsSection />
      </Suspense>

      {/* Features Section */}
      <Suspense fallback={<SectionSkeleton />}>
        <FeaturesSection />
      </Suspense>

      {/* Courses Section */}
      <Suspense fallback={<SectionSkeleton />}>
        <CoursesSection />
      </Suspense>

      {/* Faculty Section */}
      <Suspense fallback={<SectionSkeleton />}>
        <FacultySection />
      </Suspense>

      {/* Testimonials Section */}
      <Suspense fallback={<SectionSkeleton />}>
        <TestimonialsSection />
      </Suspense>

      {/* Contact Section */}
      <Suspense fallback={<SectionSkeleton />}>
        <ContactSection />
      </Suspense>

      {/* Final CTA Section */}
      <Suspense fallback={<SectionSkeleton />}>
        <FinalCtaSection />
      </Suspense>

      {/* Footer */}
      <Suspense fallback={<div className="h-32 bg-gray-900"></div>}>
        <Footer />
      </Suspense>
    </>
  )
}

// Page metadata
// Add the explicit type annotation
export const metadata: Metadata = {
  title: 'Kanchen Academy - Transform Your Dreams into Civil Service Success',
  description: 'Join India\'s most innovative coaching institute with AI-powered learning tools for UPSC, SSC, and State PCS examinations.',
}

