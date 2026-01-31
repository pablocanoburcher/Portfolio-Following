import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Financial Dashboard | Asset Tracker',
  description: 'Track stocks, crypto, commodities, and bonds with real-time charts and AI-powered analysis',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-dark-950 text-dark-100 min-h-screen">
        {children}
      </body>
    </html>
  )
}
