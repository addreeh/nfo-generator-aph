import { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Card,
  CardContent
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Star } from 'lucide-react'
import { AniListAnime } from '@/types/anilist'
import AnimeInfoArt from './anime-info-art'
import Image from 'next/image'

interface AnimeInfoSeasonProps {
  anime: AniListAnime
  providerData: any
  onSeasonDataChange: (seasonData: Array<{
    name: string
    background: string
    poster: string
    fanart: string
    banner: string
    image: string
    poster_path: string
  }>) => void
}

export const AnimeInfoSeason = ({ anime, providerData, onSeasonDataChange }: AnimeInfoSeasonProps): JSX.Element => {
  const [selectedProvider, setSelectedProvider] = useState('')
  const [seasonData, setSeasonData] = useState<Array<{
    name: string
    background: string
    poster: string
    fanart: string
    banner: string
    image: string
    poster_path: string
  }>>([])

  const hasValidSeasonData = (provider: string): boolean => {
    switch (provider) {
      case 'omdb':
        return providerData?.omdb?.totalSeasons && !isNaN(parseInt(providerData.omdb.totalSeasons))
      case 'tmdb':
        return providerData?.tmdb?.seasons?.length > 0
      case 'tvdb':
        return providerData?.tvdb?.seasons?.length > 0
      case 'fanart':
        return providerData?.fanart?.seasons?.length > 0
      default:
        return false
    }
  }

  const availableProviders = [
    { value: 'omdb', label: 'OMDB' },
    { value: 'tmdb', label: 'TMDB' },
    { value: 'tvdb', label: 'TVDB' },
    { value: 'fanart', label: 'Fanart' }
  ].filter(provider => hasValidSeasonData(provider.value))

  useEffect(() => {
    if (selectedProvider === 'omdb' && providerData?.omdb?.totalSeasons) {
      const totalSeasons = parseInt(providerData.omdb.totalSeasons)
      const initialSeasons = Array.from({ length: totalSeasons }, () => ({
        name: '',
        background: '',
        poster: '',
        fanart: '',
        banner: '',
        image: '',
        poster_path: ''
      }))
      setSeasonData(initialSeasons)
    } else if (selectedProvider === 'tmdb' && providerData?.tmdb?.seasons) {
      const initialSeasons = providerData.tmdb.seasons.map(() => ({
        name: '',
        background: '',
        poster: '',
        fanart: '',
        banner: '',
        image: '',
        poster_path: ''
      }))
      setSeasonData(initialSeasons)
    } else if (selectedProvider === 'tvdb' && providerData?.tvdb?.seasons) {
      const initialSeasons = providerData.tvdb.seasons.map(() => ({
        name: '',
        background: '',
        poster: '',
        fanart: '',
        banner: '',
        image: '',
        poster_path: ''
      }))
      setSeasonData(initialSeasons)
    }
  }, [selectedProvider, providerData])

  useEffect(() => {
    if (availableProviders.length > 0 && !selectedProvider) {
      setSelectedProvider(availableProviders[0].value)
    }
  }, [availableProviders, selectedProvider])

  useEffect(() => {
    onSeasonDataChange(seasonData)
  }, [seasonData, onSeasonDataChange])

  const handleSeasonChange = (seasonIndex: number, field: string, value: string): void => {
    setSeasonData(prev => {
      const newData = [...prev]
      newData[seasonIndex] = {
        ...newData[seasonIndex],
        [field]: value
      }
      return newData
    })
  }

  const handleImageSelect = (seasonIndex: number, imageType: string, imageUrl: string): void => {
    handleSeasonChange(seasonIndex, imageType, imageUrl)
  }

  useEffect(() => {
    onSeasonDataChange(seasonData)
  }, [seasonData, onSeasonDataChange])

  const renderSeasonContent = (): JSX.Element => {
    switch (selectedProvider) {
      case 'omdb':
        return (
          <div className='space-y-6'>
            {Array.from({ length: parseInt(providerData.omdb.totalSeasons) }).map((_, index) => (
              <div
                key={index}
                className='p-4 border rounded-lg space-y-4'
              >
                <div className='flex items-center justify-between'>
                  <h3 className='text-lg font-semibold'>Season {index + 1}</h3>
                  <Badge variant='outline'>OMDB</Badge>
                </div>

                <div className='grid gap-4'>
                  <div>
                    <Label htmlFor={`season-${index}-name`}>Name</Label>
                    <Input
                      id={`season-${index}-name`}
                      value={seasonData[index]?.name || ''}
                      onChange={(e) => handleSeasonChange(index, 'name', e.target.value)}
                      placeholder='Season name'
                      className='mt-1'
                    />
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <AnimeInfoArt
                        key={`${selectedProvider}-${index}-background`}
                        anime={anime}
                        providerData={providerData}
                        type='background'
                        onImageSelect={(newImage: string) => handleImageSelect(index, 'background', newImage)}
                      >
                        <Image
                          src={seasonData[index]?.background || '/placeholder.svg'}
                          alt='Background Image'
                          width={800}
                          height={200}
                          className='rounded-lg w-full object-cover'
                        />
                      </AnimeInfoArt>
                    </div>

                    <div>
                      <AnimeInfoArt
                        key={`${selectedProvider}-${index}-poster`}
                        anime={anime}
                        providerData={providerData}
                        type='poster'
                        onImageSelect={(newImage: string) => handleImageSelect(index, 'poster', newImage)}
                      >
                        <Image
                          src={seasonData[index]?.poster || '/placeholder.svg'}
                          alt='Poster Image'
                          width={800}
                          height={200}
                          className='rounded-lg w-full object-cover'
                        />
                      </AnimeInfoArt>
                    </div>

                    <div>
                      <AnimeInfoArt
                        key={`${selectedProvider}-${index}-fanart`}
                        anime={anime}
                        providerData={providerData}
                        type='fanart'
                        onImageSelect={(newImage: string) => handleImageSelect(index, 'fanart', newImage)}
                      >
                        <Image
                          src={seasonData[index]?.fanart || '/placeholder.svg'}
                          alt='Fanart Image'
                          width={800}
                          height={200}
                          className='rounded-lg w-full object-cover'
                        />
                      </AnimeInfoArt>
                    </div>

                    <div>
                      <AnimeInfoArt
                        key={`${selectedProvider}-${index}-banner`}
                        anime={anime}
                        providerData={providerData}
                        type='banner'
                        onImageSelect={(newImage: string) => handleImageSelect(index, 'banner', newImage)}
                      >
                        <Image
                          src={seasonData[index]?.banner || '/placeholder.svg'}
                          alt='Banner Image'
                          width={800}
                          height={200}
                          className='rounded-lg w-full object-cover'
                        />
                      </AnimeInfoArt>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      case 'tmdb':
        return (
          <div className='space-y-6'>
            {providerData?.tmdb?.seasons?.map((season: any, index: number) => (
              <div
                key={index}
                className='p-4 border rounded-lg space-y-4'
              >
                <div
                  className='flex items-center justify-between'
                >
                  <h3 className='text-lg font-semibold'>{season.name || `Season ${season.season_number as string}`}</h3>
                  <div className='flex gap-2'>
                    <Badge variant='default'>{season.episodes.length || 0} episodes</Badge>
                    {season.vote_average > 0 && (
                      <Badge variant='secondary'>
                        <Star className='w-4 h-4 mr-1' />
                        {season.vote_average?.toFixed(1)}
                      </Badge>
                    )}
                    <Badge variant='outline'>TMDB</Badge>
                  </div>
                </div>

                <div className='grid gap-4'>
                  <div>
                    <Label htmlFor={`season-${index}-name`}>Name</Label>
                    <Input
                      id={`season-${index}-name`}
                      value={seasonData[index]?.name || ''}
                      onChange={(e) => handleSeasonChange(index, 'name', e.target.value)}
                      placeholder='Season name'
                      className='mt-1'
                    />
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div className='col-span-2'>
                      <label className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>Overview</label>
                      <p className='text-sm text-muted-foreground mt-1'>
                        {season.overview}
                      </p>
                    </div>
                    <div>
                      <AnimeInfoArt
                        key={`${selectedProvider}-${index}-background`}
                        anime={anime}
                        providerData={providerData}
                        type='background'
                        onImageSelect={(newImage: string) => handleImageSelect(index, 'background', newImage)}
                      >
                        <Image
                          src={seasonData[index]?.background || '/placeholder.svg'}
                          alt='Background Image'
                          width={800}
                          height={200}
                          className='rounded-lg w-full object-cover'
                        />
                      </AnimeInfoArt>
                    </div>

                    <div>
                      <AnimeInfoArt
                        key={`${selectedProvider}-${index}-poster`}
                        anime={anime}
                        providerData={providerData}
                        type='poster'
                        onImageSelect={(newImage: string) => handleImageSelect(index, 'poster', newImage)}
                      >
                        <Image
                          src={seasonData[index]?.poster || '/placeholder.svg'}
                          alt='Poster Image'
                          width={800}
                          height={200}
                          className='rounded-lg w-full object-cover'
                        />
                      </AnimeInfoArt>
                    </div>

                    <div>
                      <AnimeInfoArt
                        key={`${selectedProvider}-${index}-fanart`}
                        anime={anime}
                        providerData={providerData}
                        type='fanart'
                        onImageSelect={(newImage: string) => handleImageSelect(index, 'fanart', newImage)}
                      >
                        <Image
                          src={seasonData[index]?.fanart || '/placeholder.svg'}
                          alt='Fanart Image'
                          width={800}
                          height={200}
                          className='rounded-lg w-full object-cover'
                        />
                      </AnimeInfoArt>
                    </div>

                    <div>
                      <AnimeInfoArt
                        key={`${selectedProvider}-${index}-banner`}
                        anime={anime}
                        providerData={providerData}
                        type='banner'
                        onImageSelect={(newImage: string) => handleImageSelect(index, 'banner', newImage)}
                      >
                        <Image
                          src={seasonData[index]?.banner || '/placeholder.svg'}
                          alt='Banner Image'
                          width={800}
                          height={200}
                          className='rounded-lg w-full object-cover'
                        />
                      </AnimeInfoArt>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )

      case 'tvdb':
        return (
          <div className='space-y-6'>
            {providerData?.tvdb?.seasons?.map((season: any, index: number) => (
              <div
                key={index}
                className='p-4 border rounded-lg space-y-4'
              >
                <div
                  className='flex items-center justify-between'
                >
                  <h3 className='text-lg font-semibold'>{season.name || `Season ${season.number as string}`}</h3>
                  <div className='flex gap-2'>
                    <Badge variant='default'>Episodes</Badge>
                    <Badge variant='outline'>TVDB</Badge>
                  </div>
                </div>

                <div className='grid gap-4'>
                  <div>
                    <Label htmlFor={`season-${index}-name`}>Name</Label>
                    <Input
                      id={`season-${index}-name`}
                      value={seasonData[index]?.name || ''}
                      onChange={(e) => handleSeasonChange(index, 'name', e.target.value)}
                      placeholder='Season name'
                      className='mt-1'
                    />
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div className='col-span-2'>
                      <label className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>Overview</label>
                      <p className='text-sm text-muted-foreground mt-1'>
                        {season.overview}
                      </p>
                    </div>
                    <div>
                      <AnimeInfoArt
                        key={`${selectedProvider}-${index}-background`}
                        anime={anime}
                        providerData={providerData}
                        type='background'
                        onImageSelect={(newImage: string) => handleImageSelect(index, 'background', newImage)}
                      >
                        <Image
                          src={seasonData[index]?.background || '/placeholder.svg'}
                          alt='Background Image'
                          width={800}
                          height={200}
                          className='rounded-lg w-full object-cover'
                        />
                      </AnimeInfoArt>
                    </div>

                    <div>
                      <AnimeInfoArt
                        key={`${selectedProvider}-${index}-poster`}
                        anime={anime}
                        providerData={providerData}
                        type='poster'
                        onImageSelect={(newImage: string) => handleImageSelect(index, 'poster', newImage)}
                      >
                        <Image
                          src={seasonData[index]?.poster || '/placeholder.svg'}
                          alt='Poster Image'
                          width={800}
                          height={200}
                          className='rounded-lg w-full object-cover'
                        />
                      </AnimeInfoArt>
                    </div>

                    <div>
                      <AnimeInfoArt
                        key={`${selectedProvider}-${index}-fanart`}
                        anime={anime}
                        providerData={providerData}
                        type='fanart'
                        onImageSelect={(newImage: string) => handleImageSelect(index, 'fanart', newImage)}
                      >
                        <Image
                          src={seasonData[index]?.fanart || '/placeholder.svg'}
                          alt='Fanart Image'
                          width={800}
                          height={200}
                          className='rounded-lg w-full object-cover'
                        />
                      </AnimeInfoArt>
                    </div>

                    <div>
                      <AnimeInfoArt
                        key={`${selectedProvider}-${index}-banner`}
                        anime={anime}
                        providerData={providerData}
                        type='banner'
                        onImageSelect={(newImage: string) => handleImageSelect(index, 'banner', newImage)}
                      >
                        <Image
                          src={seasonData[index]?.banner || '/placeholder.svg'}
                          alt='Banner Image'
                          width={800}
                          height={200}
                          className='rounded-lg w-full object-cover'
                        />
                      </AnimeInfoArt>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      default:
        return (
          <p className='text-muted-foreground'>No season data available for this provider</p>
        )
    }
  }

  if (availableProviders.length === 0) {
    return <></>
  }

  return (
    <Card>
      <CardContent className='p-5'>
        <div className='space-y-4'>
          {availableProviders.length > 1 && (
            <div>
              <Label
                htmlFor='provider-select'
                className='text-lg font-semibold mb-2'
              >
                Select Provider
              </Label>
              <Select
                value={selectedProvider}
                onValueChange={setSelectedProvider}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select a provider' />
                </SelectTrigger>
                <SelectContent>
                  {availableProviders.map((provider) => (
                    <SelectItem
                      key={provider.value}
                      value={provider.value}
                    >
                      {provider.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <ScrollArea className='h-[400px] rounded-md border p-4'>
            {renderSeasonContent()}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  )
}

export default AnimeInfoSeason
