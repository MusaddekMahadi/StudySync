import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "StudySync - Organize Your Study, Boost Your Focus",
  description:
    "A comprehensive, accessible study time and task management platform designed specifically for students. Manage tasks, track time, and organize study resources efficiently.",
  keywords: "study, time management, tasks, students, productivity, focus, education, learning",
  authors: [{ name: "StudySync Team" }],
  creator: "StudySync",
  publisher: "StudySync",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://studysync.app",
    title: "StudySync - Student Study Management Platform",
    description:
      "Organize your study time, manage tasks, and boost your focus with our comprehensive student platform.",
    siteName: "StudySync",
  },
  twitter: {
    card: "summary_large_image",
    title: "StudySync - Organize Your Study, Boost Your Focus",
    description: "A comprehensive study management platform for students.",
  },
    generator: 'v0.dev'
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1f2937" },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
