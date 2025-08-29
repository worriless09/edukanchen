
import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { AuthProvider } from "@/components/auth/AuthProvider"
import { ErrorBoundary } from "@/components/ErrorBoundary"

export const metadata: Metadata = {
  title: {
    default: "Kanchen Academy - Transform Your Dreams into Civil Service Success",
    template: "%s | Kanchen Academy"
  },
  description: "Join India's most innovative coaching institute with AI-powered learning tools for UPSC, SSC, and State PCS examinations. Expert faculty, comprehensive courses, and proven success record.",
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
    "Kanchen Academy"
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
    title: "Kanchen Academy - Transform Your Dreams into Civil Service Success",
    description: "Join India's most innovative coaching institute with AI-powered learning tools for UPSC, SSC, and State PCS examinations.",
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
    title: "Kanchen Academy - Transform Your Dreams into Civil Service Success",
    description: "Join India's most innovative coaching institute with AI-powered learning tools for UPSC, SSC, and State PCS examinations.",
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
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#3b82f6" />
        
        {/* Viewport meta tag for responsive design */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      
      <body>
        <ErrorBoundary>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
