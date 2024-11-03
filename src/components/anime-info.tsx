'use client'

import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { formatDateUS, getImageAlt, getImageSource } from '@/utils/mix'
import { AniListAnime } from '@/types/anilist'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Provider, ProviderData } from '@/types'
import { TMDBAnime } from '@/types/tmdb'
import { OMDBAnime } from '@/types/omdb'
import { TVDBAnime } from '@/types/tvdb'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clapperboard, Clock, Film, PlayCircle, Star, Tv } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TVMazeAnime } from '@/types/tvmaze'

interface AnimeInfoProps {
  selectedAnime: AniListAnime | undefined
  selectedProvider: Provider
  setSelectedProvider: (provider: Provider) => void
  providerData: ProviderData
  setProviderData: (providerData: ProviderData) => void
  loading: boolean
}

export const AnimeInfo = ({ selectedAnime, selectedProvider, setSelectedProvider, providerData, setProviderData, loading }: AnimeInfoProps): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false)

  const handleProviderChange = (provider: Provider): void => {
    setIsLoading(true)
    try {
      setSelectedProvider(provider)
    } catch (error) {
      console.error(`Error fetching data from ${provider}:`, error)
    } finally {
      setIsLoading(false)
    }
  }

  const getCurrentProviderData = (): AniListAnime | OMDBAnime | TMDBAnime | TVDBAnime | TVMazeAnime | undefined => {
    if (selectedProvider === 'anilist') {
      return selectedAnime
    }
    return providerData[selectedProvider]
  }

  const renderAnimeInfo = (): JSX.Element => {
    const currentData = getCurrentProviderData()

    if (!currentData) return <></>

    const commonLayout = (props: {
      title: string
      subtitle: string
      genres: string[]
      dates: string
      status: string
      episodes: string
      duration: string
      score: string
      studio: string
      synopsis: string
      trailerButton?: JSX.Element
    }): JSX.Element => (
      <div className='flex flex-col gap-3'>
        <div className='flex flex-col gap-1'>
          <div className='flex flex-col'>
            <h2 className='text-2xl font-bold truncate'>{props.title}</h2>
            <p className='text-lg text-muted-foreground font-mono truncate'>{props.subtitle}</p>
          </div>
          {props.trailerButton && (
            <div className='mt-2'>
              {props.trailerButton}
            </div>
          )}
        </div>

        <div className='flex flex-wrap gap-2 overflow-x-auto max-h-24 md:max-h-16'>
          {props.genres.map((genre, index) => (
            <Badge
              key={index}
              variant='secondary'
            >{genre}
            </Badge>
          ))}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4'>
          <div className='flex items-center gap-2 font-mono truncate'>
            <Calendar className='h-4 w-4 flex-shrink-0' />
            <p className='mt-1 truncate'>{props.dates}</p>
          </div>
          <div className='flex items-center gap-2'>
            <Tv
              className='h-4 w-4 flex-shrink-0'
              fill='white'
            />
            <p className='mt-1 font-bold truncate'>Status: <span className='font-mono font-normal'>{props.status}</span></p>
          </div>
          <div className='flex items-center gap-2'>
            <Film className='h-4 w-4 flex-shrink-0' />
            <p className='mt-0.5 font-bold truncate'>Episodes: <span className='font-mono font-normal'>{props.episodes}</span></p>
          </div>
          <div className='flex items-center gap-2'>
            <Clock className='h-4 w-4 flex-shrink-0' />
            <p className='mt-0.5 font-bold truncate'>Duration: <span className='font-mono font-normal'>{props.duration}</span></p>
          </div>
          <div className='flex items-center gap-2'>
            <Star
              className='h-4 w-4 flex-shrink-0'
              fill='white'
            />
            <p className='mt-1 font-bold truncate'>Score: <span className='font-mono font-normal'>{props.score}</span></p>
          </div>
          <div className='flex items-center gap-2'>
            <Clapperboard className='h-4 w-4 flex-shrink-0' />
            <p className='mt-1 font-bold truncate'>Studio: <span className='font-mono font-normal'>{props.studio}</span></p>
          </div>
        </div>
        <div className='mt-2'>
          <p className='font-semibold'>Synopsis:</p>
          <p className='text-muted-foreground text-sm font-mono line-clamp-3 md:line-clamp-4'>{props.synopsis}</p>
        </div>
      </div>
    )

    switch (selectedProvider) {
      case 'anilist': {
        const anilistData = currentData as AniListAnime
        return commonLayout({
          title: anilistData.title.romaji,
          subtitle: anilistData.title.english || anilistData.title.romaji,
          genres: anilistData.genres || [],
          dates: `${anilistData.startDate?.year}-${anilistData.startDate?.month}-${anilistData.startDate?.day} - ${anilistData.endDate?.year}-${anilistData.endDate?.month}-${anilistData.endDate?.day}`,
          status: anilistData.status,
          episodes: anilistData.episodes?.toString() || 'Unknown',
          duration: `${anilistData.duration || 'Unknown'} min`,
          score: `${anilistData.averageScore}%`,
          studio: anilistData.studios?.nodes?.[0]?.name || 'Unknown',
          synopsis: anilistData.description?.replace(/<[^>]*>?/gm, '') || '',
          trailerButton: anilistData.trailer && (
            <Button
              variant='outline'
              className='w-40 h-full'
              onClick={() => window.open(`https://youtube.com/watch?v=${anilistData.trailer.id}`, '_blank')}
            >
              <PlayCircle className='h-4 w-4 mr-2' />
              Watch Trailer
            </Button>
          )
        })
      }

      case 'omdb': {
        const omdbData = currentData as OMDBAnime
        return commonLayout({
          title: omdbData.Title,
          subtitle: omdbData.Title,
          genres: omdbData.Genre?.split(', ') || [],
          dates: `${formatDateUS(omdbData.Released)} -`,
          status: 'Unknown',
          episodes: omdbData.totalSeasons ? `${omdbData.totalSeasons} seasons` : 'Unknown',
          duration: 'Unknown',
          score: omdbData.Ratings[0]?.Value || 'Unknown',
          studio: 'Unknown',
          synopsis: omdbData.Plot
        })
      }

      case 'tmdb': {
        const tmdbData = currentData as TMDBAnime
        return commonLayout({
          title: tmdbData.original_name,
          subtitle: tmdbData.original_name,
          genres: tmdbData.genres?.map(g => g.name) || [],
          dates: `${formatDateUS(new Date(tmdbData.first_air_date).toLocaleDateString())} - ${formatDateUS(new Date(tmdbData.last_air_date).toLocaleDateString())}`,
          status: tmdbData.status,
          episodes: `${tmdbData.number_of_seasons || 'Unknown'} seasons, ${tmdbData.number_of_episodes || 'Unknown'} episodes`,
          duration: `${tmdbData.episode_run_time?.[0] ? `${tmdbData.episode_run_time[0]}` : 'Unknown'} min`,
          score: `${tmdbData.vote_average}/10`,
          studio: 'Unknown',
          synopsis: tmdbData.overview || '',
          trailerButton: tmdbData.videos && (
            <Button
              variant='outline'
              className='w-40 h-full'
              onClick={() => window.open(tmdbData.videos.results[0].url, '_blank')}
            >
              <PlayCircle className='h-4 w-4 mr-2' />
              Watch Trailer
            </Button>
          )
        })
      }

      case 'tvdb': {
        const tvdbData = currentData as TVDBAnime
        return commonLayout({
          title: tvdbData.name,
          subtitle: tvdbData.aliases.find(a => a.language === 'jpn')?.name ?? tvdbData.name,
          genres: tvdbData.genres?.map(g => g.name) || [],
          dates: `${formatDateUS(new Date(tvdbData.firstAired).toLocaleDateString())} - ${formatDateUS(new Date(tvdbData.lastAired).toLocaleDateString())}`,
          status: tvdbData.status.name,
          episodes: `${tvdbData.seasons.length || 'Unknown'} seasons, ${tvdbData.episodes.length || 'Unknown'} episodes`,
          duration: `${tvdbData.averageRuntime || 'Unknown'} min`,
          score: tvdbData.score?.toString() || 'Unknown',
          studio: 'Unknown',
          synopsis: tvdbData.overview || ''
        })
      }

      case 'tvmaze': {
        const tvmazeData = currentData as TVMazeAnime
        return commonLayout({
          title: tvmazeData.show.name,
          subtitle: tvmazeData.show.name,
          genres: tvmazeData.show.genres || [],
          dates: `${tvmazeData.show.premiered ?? 'Unknown'} - ${tvmazeData.show.ended ?? 'Ongoing'}`,
          status: tvmazeData.show.status,
          episodes: tvmazeData.episodes.length?.toString() || 'Unknown',
          duration: `${tvmazeData.show.averageRuntime ?? 'Unknown'} min`,
          score: `${tvmazeData.show.rating.average ?? 'Unknown'}/10`,
          studio: 'Unknown',
          synopsis: tvmazeData.show.summary?.replace(/<[^>]*>?/gm, '') ?? ''
        })
      }

      default:
        return <></>
    }
  }

  return (
    <>
      {selectedAnime && (
        <Card className='mt-4'>
          <CardContent className='p-4'>
            <div className='flex flex-col md:flex-row gap-4'>
              <div className='flex flex-col space-y-4 md:w-60 w-full items-center md:items-start'>
                <div className='relative w-[240px] h-[400px] md:h-[340px] flex-shrink-0'>
                  <Image
                    src={getImageSource(selectedProvider, getCurrentProviderData())}
                    alt={getImageAlt(selectedProvider, getCurrentProviderData())}
                    fill
                    className='object-cover rounded-lg'
                    sizes='(max-width: 768px) 240px, 240px'
                  />
                </div>
                <Select
                  onValueChange={(value: Provider) => handleProviderChange(value)}
                  defaultValue={selectedProvider}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select provider' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='anilist'>AniList</SelectItem>
                    <SelectItem value='omdb'>OMDB</SelectItem>
                    <SelectItem value='tmdb'>TMDB</SelectItem>
                    <SelectItem value='tvdb'>TVDB</SelectItem>
                    <SelectItem value='tvmaze'>TVMaze</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='flex-1 min-w-0'> {/* min-w-0 ayuda con el truncate en flex items */}
                <div className='h-full'>
                  {isLoading
                    ? (
                      <div className='min-h-5'>
                        <p className='text-muted-foreground'>Loading provider data...</p>
                      </div>
                      )
                    : (
                        renderAnimeInfo()
                      )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}
