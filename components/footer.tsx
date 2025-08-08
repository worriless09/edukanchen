import { BookOpen, Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-primary-400" />
              <span className="text-2xl font-bold">Kanchen Academy</span>
            </div>
            <p className="text-gray-400">
              Empowering aspirants with AI-powered learning for UPSC, SSC, and State PCS success.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-primary-400 cursor-pointer" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-primary-400 cursor-pointer" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-primary-400 cursor-pointer" />
              <Youtube className="h-5 w-5 text-gray-400 hover:text-primary-400 cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-primary-400">About Us</a></li>
              <li><a href="#courses" className="hover:text-primary-400">Courses</a></li>
              <li><a href="#faculty" className="hover:text-primary-400">Faculty</a></li>
              <li><a href="#" className="hover:text-primary-400">Success Stories</a></li>
              <li><a href="#contact" className="hover:text-primary-400">Contact</a></li>
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Popular Courses</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-primary-400">UPSC CSE</a></li>
              <li><a href="#" className="hover:text-primary-400">SSC CGL</a></li>
              <li><a href="#" className="hover:text-primary-400">SSC CHSL</a></li>
              <li><a href="#" className="hover:text-primary-400">State PCS</a></li>
              <li><a href="#" className="hover:text-primary-400">Banking Exams</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-400 mb-4">Subscribe to get latest updates and study materials.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button className="px-4 py-2 bg-primary-400 hover:bg-primary-500 rounded-r-md">
                <Mail className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Kanchen Academy. All rights reserved. | Privacy Policy | Terms of Service</p>
        </div>
      </div>
    </footer>
  )
}
