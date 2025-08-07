import { Button } from '@/components/ui/button'

export function FinalCtaSection() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl lg:text-4xl font-normal text-gray-900 mb-6">
          Ready to Conquer Your Exam?
        </h2>
        <p className="text-lg text-gray-700 mb-8 font-light leading-relaxed">
          Join thousands of successful candidates who transformed their preparation with our AI-powered learning system.
        </p>
        
        <Button size="lg" className="hover:bg-primary-500 text-white px-8 py-4 text-base font-medium rounded-lg mb-6 bg-primary-700">
          Get Started Now
        </Button>
        
        <p className="text-sm text-gray-600 font-light">
          No credit card required • Cancel anytime • 7-day free trial
        </p>
        
        {/* Additional trust elements */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-primary-400 rounded-full"></div>
              <span>Money-back guarantee</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-primary-400 rounded-full"></div>
              <span>24/7 support</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-primary-400 rounded-full"></div>
              <span>Instant access</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
