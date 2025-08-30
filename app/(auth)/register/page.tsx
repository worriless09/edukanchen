// app/(auth)/register/page.tsx
import RegisterForm from "@/components/auth/RegisterForm"
import Link from "next/link"
import Image from "next/image"

export default function RegisterPage() {
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
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
          Join Kanchen Academy
        </h2>
        <p className="text-gray-600 mb-8">
          Start your exam preparation journey with AI-powered learning
        </p>
      </div>
      
      <RegisterForm />
      
      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link 
            href="/login" 
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </>
  )
}
