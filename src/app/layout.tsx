"use client"
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/header'
import { QueryProvider } from '@/providers/query-provider'
import { ReduxProvider } from '@/providers/redux-provider'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <ReduxProvider>
          <QueryProvider>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <div className="flex-1">
                {children}
              </div>
            </div>
            <Toaster />
          </QueryProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}