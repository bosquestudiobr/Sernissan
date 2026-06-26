import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'

import { TooltipProvider } from '@/components/ui/tooltip'
import './globals.css'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SerNissan',
  description: 'Plataforma SerNissan — reconstrucao Next.js + Supabase',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${roboto.variable} ${roboto.className} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  )
}
