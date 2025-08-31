import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/auth/AuthProvider"
import { ClientLayoutProvider } from "@/components/layout/ClientLayoutProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Kanchen Academy - AI-Powered Education Platform",
  description: "Transform your dreams into civil service success",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ClientLayoutProvider>
            {children}
          </ClientLayoutProvider>
        </AuthProvider>
      </body>
    </html>
  )
}