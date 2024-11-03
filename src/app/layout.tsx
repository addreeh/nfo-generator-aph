import localFont from 'next/font/local'
import './globals.css'
import { Providers } from './providers'
import { ViewTransitions } from 'next-view-transitions'
import { Toaster } from '@/components/ui/toaster'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900'
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900'
})

export const metadata = {
  title: 'NFOGeneratorAPH',
  description: 'Aggregate anime data from multiple sources'
}

export default function RootLayout ({
  children
}: Readonly<{
  children: React.ReactNode
}>): JSX.Element {
  return (
    <ViewTransitions>
      <html
        lang='es'
        suppressHydrationWarning
      >
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
        >
          <Providers>
            {children}
            <Toaster />
          </Providers>
        </body>
      </html>
    </ViewTransitions>
  )
}
