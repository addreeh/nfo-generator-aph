'use client'

import { ThemeProvider } from 'next-themes'

export function Providers ({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='system'
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  )
}
