import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/components/auth/AuthProvider';

 const inter = Inter({ subsets: ['latin'] }); 

export const metadata: Metadata = {
  title: 'Kanchen Academy - Transform Your Dreams into Civil Service Success',
  description: 'Join India\'s most innovative coaching institute with AI-powered learning tools for UPSC, SSC, and State PCS examinations.',
  generator: 'Kanchen',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script 
          src="https://checkout.razorpay.com/v1/checkout.js"
          async
        />
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
    
  )
}
