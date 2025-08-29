import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Inter } from "next/font/google"
import Link from "next/link"
import "./globals.css"
import { AuthProvider } from "@/components/auth/AuthProvider"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import Image from "next/image"
import { Navigation } from '@/components/Navigation'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Kanchen Academy - Transform Your Dreams into Civil Service Success",
    template: "%s | Kanchen Academy",
  },
  description:
    "Join India's most innovative coaching institute with AI-powered learning tools for UPSC, SSC, and State PCS examinations. Expert faculty, comprehensive courses, and proven success record.",
  keywords: [
    "UPSC preparation",
    "civil services coaching",
    "IAS coaching",
    "SSC preparation",
    "state PCS coaching",
    "online coaching",
    "AI-powered learning",
    "mock tests",
    "current affairs",
    "Kanchen Academy",
  ],
  authors: [{ name: "Kanchen Academy" }],
  creator: "Kanchen Academy",
  publisher: "Kanchen Academy",
  metadataBase: new URL("https://kanchenacademy.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    title:
      "Kanchen Academy - Transform Your Dreams into Civil Service Success",
    description:
      "Join India's most innovative coaching institute with AI-powered learning tools for UPSC, SSC, and State PCS examinations.",
    siteName: "Kanchen Academy",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kanchen Academy - Civil Services Coaching",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Kanchen Academy - Transform Your Dreams into Civil Service Success",
    description:
      "Join India's most innovative coaching institute with AI-powered learning tools for UPSC, SSC, and State PCS examinations.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#000000" />

        {/* Viewport meta tag for responsive design */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ErrorBoundary>
          <AuthProvider>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
<Navigation />
              <main>{children}</main>
            </div>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}


export function OptimizedLayoutNav() {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kanchen-m9v7Y6xyNyNxVd7iwVDUqCPKEbRfrc.png"
                alt="Kanchen Academy Logo"
                width={150}
                height={120}
                className="w-24 h-8 md:w-32 md:h-10 object-contain"
                priority
              />
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Home
            </Link>
            <Link href="/ai-analyzer" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              AI Analyzer
            </Link>
            <Link href="/flashcards" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Flashcards
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
