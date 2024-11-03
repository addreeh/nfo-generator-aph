'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AniListAnime } from '@/types/anilist'
import { debounce } from 'lodash'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { useTransitionRouter } from 'next-view-transitions'

interface AnimeSearcherProps {
  searchFormat: string
  setSearchFormat: (value: string) => void
}

export const AnimeSearcher = ({
  searchFormat,
  setSearchFormat
}: AnimeSearcherProps): JSX.Element => {
  const router = useTransitionRouter()
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<AniListAnime[]>([])
  const type = 'ANIME'

  const debouncedSearch = useCallback(
    debounce(async (query: string, format: string) => {
      if (query.length > 0) {
        setLoading(true)
        try {
          const formats = format === 'all' ? '' : format
          const response = await fetch(`/api/anilist?query=${encodeURIComponent(query)}&type=${type}&formats=${encodeURIComponent(formats)}`)
          if (!response.ok) {
            throw new Error('Failed to fetch anime')
          }
          const results = await response.json()
          setSuggestions(results || [])
        } catch (error) {
          console.error('Error fetching anime:', error)
          setSuggestions([])
        } finally {
          setLoading(false)
        }
      } else {
        setSuggestions([])
        setLoading(false)
      }
    }, 300),
    []
  )

  useEffect(() => {
    debouncedSearch(search, searchFormat)?.catch(console.error)
  }, [search, searchFormat, debouncedSearch])

  const handleAnimeSelect = (anime: AniListAnime): void => {
    console.log('anilist', anime)
    localStorage.setItem('anilistAnime', JSON.stringify(anime))

    router.push(`/anime/${anime.title.romaji.split(' ')[0].replace(/[^A-Za-z0-9]/g, '').toLocaleLowerCase()}`)
  }

  return (
    <div className='flex flex-col space-y-2 w-full'>
      <div className='flex space-x-2 font-mono'>
        <Select
          onValueChange={setSearchFormat}
          defaultValue={searchFormat}
        >
          <SelectTrigger className='w-[180px] font-mono'>
            <SelectValue placeholder='Filter format' />
          </SelectTrigger>
          <SelectContent className='font-mono'>
            <SelectItem value='all'>All</SelectItem>
            <SelectItem value='TV'>TV</SelectItem>
            <SelectItem value='OVA'>OVA</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type='text'
          placeholder='Search anime...'
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          className='flex-grow font-mono'
        />
      </div>

      <>
        {loading
          ? (<div className='font-mono min-h-5'>Loading...</div>)
          : (
              !loading && suggestions.length === 0 && search.length > 0
                ? (
                  <div className='font-mono min-h-5'>No results found. Try a different search term.</div>
                  )
                : (
                  <div className='min-h-5' />
                  ))}

        {suggestions.length > 0 && (
          <Card className='mt-2'>
            <CardContent className='p-2'>
              {suggestions.map((anime, index) => (
                <div
                  key={index}
                  onClick={() => handleAnimeSelect(anime)}
                  className='flex items-center space-x-2 p-2 hover:bg-accent cursor-pointer'
                >
                  <Image
                    src={anime.coverImage?.medium || '/api/placeholder/40/56'}
                    alt={anime.title?.romaji || 'Anime cover'}
                    width={40}
                    height={56}
                    className='w-10 h-14 object-cover'
                  />
                  <div>
                    <p className='font-semibold'>{anime.title?.romaji || 'Unknown title'}</p>
                    <p className='text-sm text-muted-foreground font-mono'>{anime.title?.english || ''}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </>
    </div>
  )
}
