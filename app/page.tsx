import UnifiedKanchenAcademy from "@/components/UnifiedKanchenAcademy"
import { HeroSectionResponsive } from "@/components/hero-section-responsive"
import { StudyMaterialsSection } from "@/components/study-materials-section"
import { FeaturesSection } from "@/components/features-section"
import { CoursesSection } from "@/components/courses-section"
import { FacultySection } from "@/components/faculty-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { FinalCtaSection } from "@/components/final-cta-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <UnifiedKanchenAcademy children={undefined} />
      <HeroSectionResponsive />
      <StudyMaterialsSection />
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
