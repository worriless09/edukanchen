import { Button } from "@/components/ui/button"
import { ArrowRight, Phone, Mail } from "lucide-react"

export function FinalCtaSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-cyan-800 to-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">Ready to Start Your Success Journey?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of successful candidates who transformed their dreams into reality with Kanchen Academy.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-white text-cyan-800 hover:bg-gray-100 px-8 py-4">
              Book Free Demo Class
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-cyan-800 px-8 py-4 bg-transparent"
            >
              Download Brochure
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center">
              <Phone className="h-5 w-5 mr-3" />
              <div>
                <p className="text-blue-100 text-sm">Call us now</p>
                <p className="font-semibold">+91 98765 43210</p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Mail className="h-5 w-5 mr-3" />
              <div>
                <p className="text-blue-100 text-sm">Email us</p>
                <p className="font-semibold">info@kanchenacademy.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
