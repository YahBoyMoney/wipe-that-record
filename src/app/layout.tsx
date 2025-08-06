import { Inter } from 'next/font/google'
import LocalBusinessSchema from '@/components/LocalBusinessSchema'
import GoogleAnalytics from '@/components/GoogleAnalytics'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'WipeThatRecord - California Expungement Services',
  description: 'Professional criminal record expungement services in California. Clear your record with experienced attorneys.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <LocalBusinessSchema />
        <GoogleAnalytics />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}