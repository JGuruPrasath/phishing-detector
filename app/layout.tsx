import type React from "react"
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css"


export const metadata = {
  title: "PhishGuard - Advanced URL Security Scanner",
  description:
    "AI-powered phishing detection system with 97% accuracy. Protect yourself from malicious URLs and cyber threats.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
      <body className="min-h-screen bg-background font-sans">{children}</body>
    </html>
  )
}
