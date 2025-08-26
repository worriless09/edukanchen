import { Header } from '@/components/header'
import { HeroSection } from '@/components/hero-section'
import { FeaturesSection } from '@/components/features-section'
import { CoursesSection } from '@/components/courses-section'
import { FacultySection } from '@/components/faculty-section'
import { TestimonialsSection } from '@/components/testimonials-section'
import { FinalCtaSection } from '@/components/final-cta-section'
import { ContactSection } from '@/components/contact-section'
import { Footer } from '@/components/footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <CoursesSection />
      <FacultySection />
      <TestimonialsSection />
      <FinalCtaSection />
      <ContactSection />
      <Footer />
    </div>
  )
}
