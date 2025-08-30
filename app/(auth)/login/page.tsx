// app/(auth)/login/page.tsx
import LoginForm from "@/components/auth/LoginForm"
import Link from "next/link"
import Image from "next/image"

export default function LoginPage() {
  return (
    <>
      <div className="text-center">
        <div className="flex justify-center mb-6">
          {/* Logo using next/image */}
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kanchen-m9v7Y6xyNyNxVd7iwVDUqCPKEbRfrc.png"
            alt="Kanchen Academy Logo"
            width={80}
            height={80}
            className="rounded-full shadow-md"
            priority
          />
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-2xl">KA</span>
          </div>
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
          Welcome back to Kanchen Academy
        </h2>
        <p className="text-gray-600 mb-8">
          Sign in to continue your learning journey
        </p>
      </div>
      
      <LoginForm />
      
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link 
            href="/register" 
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            Sign up here
          </Link>
        </p>
      </div>
    </>
  )
}