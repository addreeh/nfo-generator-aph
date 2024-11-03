/* eslint-disable no-case-declarations */
'use client'

import { useState, useEffect, useMemo, isValidElement } from 'react'
import { Label } from '@/components/ui/label'
import Image from 'next/image'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AniListAnime } from '@/types/anilist'

const TVDB_TYPES = {
  POSTER: 2,
  BACKGROUND: 3,
  BANNER: 1,
  ICON: 5,
  SEASONPOSTER: 7,
  CLEARLOGO: 23,
  CLEARART: 22,
  FANART: 3
}

const getTvdbTypeForImageType = (imageType: string): number => {
  switch (imageType.toLowerCase()) {
    case 'poster': return TVDB_TYPES.POSTER
    case 'background':
    case 'backdrop': return TVDB_TYPES.BACKGROUND
    case 'banner': return TVDB_TYPES.BANNER
    case 'icon': return TVDB_TYPES.ICON
    case 'seasonposter': return TVDB_TYPES.SEASONPOSTER
    case 'logo': return TVDB_TYPES.CLEARLOGO
    case 'clearart': return TVDB_TYPES.CLEARART
    case 'fanart': return TVDB_TYPES.FANART
    default: return TVDB_TYPES.POSTER
  }
}

const isFanartUrl = (url: string): boolean => url.includes('/banners/fanart/original/')
const isBackgroundUrl = (url: string): boolean => url.includes('/banners/v4/series/') && url.includes('/backgrounds/')

interface AnimeInfoArtProps {
  anime: AniListAnime
  providerData: any
  type: string
  children?: React.ReactNode
  onImageSelect?: (url: string) => void
}

export default function AnimeInfoArt ({ anime, providerData, type, children, onImageSelect }: AnimeInfoArtProps): JSX.Element {
  const defaultImage = '/placeholder.svg'

  const availableProviders = useMemo(() => {
    const providers = []

    if (providerData?.omdb?.Poster && type === 'poster') {
      providers.push('omdb')
    }

    if (providerData?.tmdb?.images) {
      const tmdbImages = {
        poster: providerData.tmdb.images.posters,
        logo: providerData.tmdb.images.logos,
        background: providerData.tmdb.images.backdrops
      }
      if (type in tmdbImages && tmdbImages[type as keyof typeof tmdbImages]?.length > 0) {
        providers.push('tmdb')
      }
    }

    if (providerData?.tvdb?.artworks?.some((artwork: any) => {
      const tvdbType = getTvdbTypeForImageType(type)
      return artwork.type === tvdbType
    })) {
      providers.push('tvdb')
    }

    if (providerData?.fanart) {
      const fanartMapping = {
        poster: providerData.fanart.movieposter || providerData.fanart.tvposter,
        logo: providerData.fanart.hdtvlogo || providerData.fanart.clearlogo,
        clearart: providerData.fanart.hdclearart || providerData.fanart.clearart,
        background: providerData.fanart.showbackground,
        characterart: providerData.fanart.characterart,
        banner: providerData.fanart.tvbanner
      }
      if (fanartMapping[type as keyof typeof fanartMapping]?.length > 0) {
        providers.push('fanart')
      }
    }

    return providers
  }, [providerData, type])

  const [provider, setProvider] = useState(() => {
    const savedProvider = localStorage.getItem('lastUsedProvider')
    return savedProvider && availableProviders.includes(savedProvider)
      ? savedProvider
      : availableProviders[0] || ''
  })

  const [selectedImage, setSelectedImage] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem('lastUsedProvider', provider)
  }, [provider])

  useEffect(() => {
    if (!isDialogOpen) {
      const savedProvider = localStorage.getItem('lastUsedProvider')
      setProvider(savedProvider && availableProviders.includes(savedProvider)
        ? savedProvider
        : availableProviders[0] || '')
    }
  }, [isDialogOpen, availableProviders])

  const handleImageSelect = (imageUrl: string): void => {
    setSelectedImage(imageUrl)
    if (onImageSelect) {
      onImageSelect(imageUrl)
    }
    setIsDialogOpen(false)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result
        handleImageSelect(imageUrl as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const renderProviderImages = (): JSX.Element => {
    if (!provider) return <></>

    const getImages = (): any => {
      switch (provider) {
        case 'omdb':
          if (type === 'poster' && providerData?.omdb?.Poster) {
            return [(
              <div
                key='omdb'
                className='cursor-pointer hover:opacity-80 transition-opacity'
                onClick={() => handleImageSelect(providerData.omdb.Poster)}
              >
                <Image
                  src={providerData.omdb.Poster}
                  width={200}
                  height={280}
                  alt={`${type} image from OMDB`}
                  className='rounded-lg'
                />
              </div>
            )]
          }
          break

        case 'tmdb':
          const tmdbBaseUrl = 'https://image.tmdb.org/t/p'
          const tmdbImages = {
            poster: providerData?.tmdb?.images?.posters,
            logo: providerData?.tmdb?.images?.logos,
            background: providerData?.tmdb?.images?.backdrops
          }

          return tmdbImages[type as keyof typeof tmdbImages]?.map((image: { urls: { original: string } }, index: number) => (
            <div
              key={index}
              className='cursor-pointer hover:opacity-80 transition-opacity'
              onClick={() => handleImageSelect(`${tmdbBaseUrl}/original${image.urls.original}`)}
            >
              <Image
                src={`${tmdbBaseUrl}/w500${image.urls.original}`}
                width={200}
                height={280}
                alt={`${type} image from TMDB`}
                className='rounded-lg'
              />
            </div>
          ))

        case 'tvdb':
          if (providerData?.tvdb?.artworks) {
            const tvdbType = getTvdbTypeForImageType(type)
            return providerData.tvdb.artworks
              .filter((artwork: any) => {
                if (artwork.type !== tvdbType) return false
                if (type.toLowerCase() === 'fanart') return isFanartUrl(artwork.image)
                if (type.toLowerCase() === 'background') return isBackgroundUrl(artwork.image)
                return true
              })
              .map((artwork: any) => (
                <div
                  key={artwork.id}
                  className='cursor-pointer hover:opacity-80 transition-opacity group relative'
                  onClick={() => handleImageSelect(artwork.image)}
                >
                  <Image
                    src={artwork.thumbnail || artwork.image}
                    width={200}
                    height={280}
                    alt={`${type} image from TVDB`}
                    className='rounded-lg'
                  />
                  <div className='absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity rounded-b-lg'>
                    {artwork.width}x{artwork.height}
                  </div>
                </div>
              ))
          }
          break

        case 'fanart':
          if (providerData?.fanart) {
            const fanartMapping = {
              poster: providerData.fanart.movieposter || providerData.fanart.tvposter,
              logo: providerData.fanart.hdtvlogo || providerData.fanart.clearlogo,
              clearart: providerData.fanart.hdclearart || providerData.fanart.clearart,
              background: providerData.fanart.showbackground,
              characterart: providerData.fanart.characterart,
              banner: providerData.fanart.tvbanner
            }

            return fanartMapping[type as keyof typeof fanartMapping]?.map((image: { url: string }, index: number) => (
              <div
                key={index}
                className='cursor-pointer hover:opacity-80 transition-opacity'
                onClick={() => handleImageSelect(image.url)}
              >
                <Image
                  src={image.url}
                  width={200}
                  height={280}
                  alt={`${type} image from Fanart`}
                  className='rounded-lg'
                />
              </div>
            ))
          }
          break
      }
      return <></>
    }

    const images = getImages()
    return images?.length
      ? images
      : (
        <div className='flex items-center justify-center w-full h-[280px] bg-gray-100 rounded-lg'>
          <p className='text-gray-500'>No images available</p>
        </div>
        )
  }

  return (
    <>
      <Label>{type.charAt(0).toUpperCase() + type.slice(1)}</Label>
      <div className='relative w-52 mt-2'>
        <Image
          src={selectedImage || (isValidElement(children) && children.props.src !== defaultImage ? children.props.src : defaultImage)}
          alt={`${type} image`}
          width={240}
          height={280}
          className='rounded-lg h-full'
        />
        <Dialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        >
          <DialogTrigger asChild>
            <Button
              className='absolute bottom-2 right-4'
              variant='secondary'
              size='sm'
            >
              Change
            </Button>
          </DialogTrigger>
          <DialogContent className='max-w-4xl'>
            <DialogHeader>
              <DialogTitle>Select Image</DialogTitle>
              {availableProviders.length > 0 && (
                <Select
                  value={provider}
                  onValueChange={setProvider}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select provider' />
                  </SelectTrigger>
                  <SelectContent>
                    {availableProviders.map(p => (
                      <SelectItem
                        key={p}
                        value={p}
                      >
                        {p.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </DialogHeader>
            <ScrollArea className='h-[600px] pr-4'>
              <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {renderProviderImages()}
              </div>
              <div className='mt-6 flex justify-center items-center'>
                <div className='space-y-2 flex flex-col justify-center items-center'>
                  <Label className='text-center block'>Upload Local Image</Label>
                  <Input
                    type='file'
                    accept='image/*'
                    onChange={handleFileSelect}
                    className='text-center'
                  />
                </div>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
