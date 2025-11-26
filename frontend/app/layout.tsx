import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '🧬 Forensic Gender Classifier - Team Metric Mind',
  description: 'ML-Based Gender Classification using 15 Mandibular Measurements',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen gradient-bg">
        {children}
      </body>
    </html>
  )
}