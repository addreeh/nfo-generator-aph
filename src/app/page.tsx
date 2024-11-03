'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { AnimeSearcher } from '@/components/anime-searcher'

export default function Page (): JSX.Element {
  const [searchFormat, setSearchFormat] = useState('TV')
  const { theme, setTheme } = useTheme()

  return (
    <div className='flex min-h-screen flex-col items-center justify-center p-24'>
      <div className='z-10 max-w-5xl w-full items-center justify-between text-sm min-h-[450px] max-h-[450px]'>
        <header className='flex justify-between items-center mb-8'>
          <h1 className='text-4xl font-bold'>Anime Aggregator</h1>
          <Button
            variant='outline'
            size='icon'
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
            <Moon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
            <span className='sr-only'>Toggle theme</span>
          </Button>
        </header>

        <main>
          <AnimeSearcher
            searchFormat={searchFormat}
            setSearchFormat={setSearchFormat}
          />
        </main>
      </div>
    </div>
  )
}
