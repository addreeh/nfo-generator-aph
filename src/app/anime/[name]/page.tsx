'use client'

import { useEffect, useState } from 'react'
import { AniListAnime } from '@/types/anilist'
import { AnimeInfo } from '@/components/anime-info'
import { Provider, ProviderData } from '@/types'
import { OMDBAnime } from '@/types/omdb'
import { TMDBAnime } from '@/types/tmdb'
import { TVDBAnime } from '@/types/tvdb'
import { FanArtAnime } from '@/types/fanart'
import AnimeMetadataEditor from '@/components/anime-metadata-editor'

export default function AnimePage (): JSX.Element {
  const [selectedAnime, setSelectedAnime] = useState<AniListAnime | null>(null)
  const [selectedProvider, setSelectedProvider] = useState<Provider>('anilist')
  const [providerData, setProviderData] = useState<ProviderData>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const storedAnime = localStorage.getItem('anilistAnime')
    if (storedAnime) {
      setSelectedAnime(JSON.parse(storedAnime))
      void fetchAllProviderData(JSON.parse(storedAnime))
    }

    return () => {
      localStorage.removeItem('anilistAnime')
    }
  }, [])

  const fetchAllProviderData = async (anime: AniListAnime): Promise<void> => {
    if (!anime) return

    setLoading(true)
    const title = anime.title?.english || anime.title?.romaji || 'Unknown Title'

    try {
      const response = await fetch(`/api/omdb?query=${encodeURIComponent(title)}`)
      const omdbData = await response.json() as OMDBAnime

      const tmdbResponse = await fetch(`/api/tmdb?query=${encodeURIComponent(title)}`)
      const tmdbData = await tmdbResponse.json() as TMDBAnime

      let tvdbData: TVDBAnime | null = null
      let fanartData: FanArtAnime | null = null

      if (tmdbData?.external_ids?.tvdb_id) {
        const [tvdbResponse, fanartResponse] = await Promise.all([
          fetch(`/api/tvdb?id=${tmdbData.external_ids.tvdb_id}`),
          fetch(`/api/fanart?id=${tmdbData.external_ids.tvdb_id}`)
        ])

        tvdbData = await tvdbResponse.json() as TVDBAnime
        fanartData = await fanartResponse.json() as FanArtAnime
      }

      let tvmazeData: any | null = null
      if (omdbData.imdbID && tmdbData?.external_ids?.tvdb_id) {
        const [tvmazeResponse] = await Promise.all([
          fetch(`/api/tvmaze?imdb=${omdbData.imdbID}&tvdb=${tmdbData.external_ids.tvdb_id}`)
        ])
        tvmazeData = await tvmazeResponse.json()
      }

      console.log('omdb', omdbData)
      console.log('tmdb', tmdbData)
      console.log('tvdb', tvdbData)
      console.log('fanart', fanartData)
      console.log('tvmaze', tvmazeData)

      const newProviderData: ProviderData = {
        omdb: omdbData,
        tmdb: tmdbData,
        tvdb: tvdbData,
        fanart: fanartData,
        tvmaze: tvmazeData
      }

      setProviderData(newProviderData)
    } catch (error) {
      console.error('Error fetching provider data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!selectedAnime) {
    return <div>Loading...</div>
  }

  return (
    <div className='flex min-h-screen flex-col items-center justify-center p-12 md:p-24'>
      <div className='z-10 max-w-5xl w-full items-center justify-between text-sm'>
        <AnimeInfo
          selectedAnime={selectedAnime}
          selectedProvider={selectedProvider}
          setSelectedProvider={setSelectedProvider}
          providerData={providerData}
          setProviderData={setProviderData}
          loading={loading}
        />
        <AnimeMetadataEditor
          anime={selectedAnime}
          providerData={providerData}
          selectedProvider={selectedProvider}
          onUpdate={(): void => {
            console.log('UPDATE')
          }}
          loading={loading}
        />
      </div>
    </div>
  )
}
