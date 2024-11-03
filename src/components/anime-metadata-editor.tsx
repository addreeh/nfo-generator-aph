import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Check, ChevronsUpDown, Download, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AniListAnime } from '@/types/anilist'
import { Textarea } from '@/components/ui/textarea'
import AnimeInfoArt from '@/components/anime-info-art'
import { AnimeInfoSeason } from '@/components/anime-info-season'
import { generateNFO } from '@/lib/nfoGenerator'
import { toast } from '@/hooks/use-toast'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

interface AnimeMetadataEditorProps {
  anime: AniListAnime
  providerData: any
  selectedProvider: string
  onUpdate: () => void
  loading: boolean
}

export default function AnimeMetadataEditor ({
  anime,
  providerData,
  selectedProvider,
  onUpdate,
  loading
}: AnimeMetadataEditorProps): JSX.Element {
  const getAniListValue = (field: string): any => {
    const mappings: { [key: string]: any } = {
      title: {
        value: anime.title.romaji,
        source: 'anilist'
      },
      originalTitle: {
        value: anime.title.native,
        source: 'anilist'
      },
      startDate: {
        value: `${anime.startDate.year}-${String(anime.startDate.month).padStart(2, '0')}-${String(anime.startDate.day).padStart(2, '0')}`,
        source: 'anilist'
      },
      endDate: {
        value: `${anime.endDate.year}-${String(anime.endDate.month).padStart(2, '0')}-${String(anime.endDate.day).padStart(2, '0')}`,
        source: 'anilist'
      },
      status: {
        value: anime.status,
        source: 'anilist'
      },
      duration: {
        value: anime.duration,
        source: 'anilist'
      },
      score: {
        value: anime.averageScore,
        source: 'anilist'
      },
      studio: {
        value: anime.studios.nodes.map(studio => studio.name).join(', '),
        source: 'anilist'
      },
      plot: {
        value: anime.description.replace(/<[^>]*>?/gm, ''),
        source: 'anilist'
      },
      genres: {
        value: anime.genres,
        source: 'anilist'
      },
      trailer: {
        value: anime.trailer?.id,
        source: 'anilist'
      }
    }
    return mappings[field] || { value: '', source: 'anilist' }
  }

  const getOMDBValue = (field: string): any => {
    const mappings: { [key: string]: any } = {
      title: providerData.omdb?.Title,
      englishTitle: providerData.omdb?.Title,
      plot: providerData.omdb?.Plot,
      score: providerData.omdb?.Ratings?.[0]?.Value,
      startDate: new Date(providerData.omdb?.Released).toISOString().substring(0, 10),
      genres: providerData.omdb?.Genre?.split(', ')
    }
    return mappings[field] || ''
  }

  const getTMDBValue = (field: string): any => {
    const mappings: { [key: string]: any } = {
      title: providerData.tmdb?.original_name,
      plot: providerData.tmdb?.overview,
      score: `${providerData.tmdb?.vote_average as string} /10`,
      status: providerData.tmdb?.status,
      startDate: providerData.tmdb?.first_air_date,
      endDate: providerData.tmdb?.last_air_date,
      genres: providerData.tmdb?.genres?.map((genre: any) => genre.name),
      seasons: providerData.tmdb?.number_of_seasons,
      duration: providerData.tmdb?.episode_run_time?.[0],
      trailer: providerData.tmdb?.videos?.results[0]?.url
    }
    return mappings[field] || ''
  }

  const getTVDBValue = (field: string): any => {
    const mappings: { [key: string]: any } = {
      title: providerData.tvdb?.name,
      plot: providerData.tvdb?.overview,
      score: providerData.tvdb?.score,
      status: providerData.tvdb?.status?.name,
      startDate: providerData.tvdb?.firstAired,
      endDate: providerData.tvdb?.lastAired,
      genres: providerData.tvdb?.genres?.map((genre: any) => genre.name),
      seasons: providerData.tvdb?.seasons?.length,
      duration: providerData.tvdb?.averageRuntime
    }
    return mappings[field] || ''
  }

  const getInitialValue = (field: string): any => {
    switch (selectedProvider) {
      case 'omdb':
        return {
          value: getOMDBValue(field),
          source: 'omdb'
        }
      case 'tmdb':
        return {
          value: getTMDBValue(field),
          source: 'tmdb'
        }
      case 'tvdb':
        return {
          value: getTVDBValue(field),
          source: 'tvdb'
        }
      default:
        return getAniListValue(field)
    }
  }

  const [editedData, setEditedData] = useState({
    title: getInitialValue('title'),
    originalTitle: getInitialValue('originalTitle'),
    englishTitle: getInitialValue('englishTitle'),
    startDate: getInitialValue('startDate'),
    status: getInitialValue('status'),
    duration: getInitialValue('duration'),
    score: getInitialValue('score'),
    studio: getInitialValue('studio'),
    plot: getInitialValue('plot')
  })

  const [seasonData, setSeasonData] = useState<Array<{
    name: string
    background: string
    poster: string
    fanart: string
    banner: string
    image: string
    poster_path: string
  }>>([])

  const [artworkImages, setArtworkImages] = useState({
    poster: '',
    logo: '',
    clearart: '',
    fanart: '',
    background: '',
    characterart: '',
    banner: ''
  })

  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setArtworkImages(prev => ({
      ...prev,
      poster: anime.coverImage.extraLarge,
      banner: anime.bannerImage || ''
    }))
  }, [anime])

  useEffect(() => {
    setEditedData({
      title: getInitialValue('title'),
      originalTitle: getInitialValue('originalTitle'),
      englishTitle: getInitialValue('englishTitle'),
      startDate: getInitialValue('startDate'),
      status: getInitialValue('status'),
      duration: getInitialValue('duration'),
      score: getInitialValue('score'),
      studio: getInitialValue('studio'),
      plot: getInitialValue('plot')
    })
  }, [selectedProvider])

  const getProviderOptions = (field: string): Array<{ label: string, value: string, source: string }> => {
    const options = [
      {
        label: 'AniList',
        value: getAniListValue(field).value,
        source: 'anilist'
      }
    ]

    if (providerData.omdb && getOMDBValue(field)) {
      options.push({
        label: 'OMDB',
        value: getOMDBValue(field),
        source: 'omdb'
      })
    }

    if (providerData.tmdb && getTMDBValue(field)) {
      options.push({
        label: 'TMDB',
        value: getTMDBValue(field),
        source: 'tmdb'
      })
    }

    if (providerData.tvdb && getTVDBValue(field)) {
      options.push({
        label: 'TVDB',
        value: getTVDBValue(field),
        source: 'tvdb'
      })
    }

    return options.filter(opt => opt.value)
  }

  const handleSave = async (): Promise<void> => {
    setIsSaving(true)
    try {
      const updatedAnime = {
        ...anime,
        imdbId: providerData.omdb?.imdbID,
        tmdbId: providerData.tmdb?.id,
        tvmazeId: providerData.tvmaze?.show?.id,
        tvdbId: providerData.tvdb?.id,
        imdbRating: providerData.omdb?.imdbRating,
        imdbVotes: providerData.omdb?.imdbVotes?.replace(',', ''),
        title: {
          ...anime.title,
          romaji: editedData.title.value,
          native: editedData.originalTitle.value
        },
        startDate: {
          ...anime.startDate
        },
        status: editedData.status.value,
        duration: editedData.duration.value,
        averageScore: editedData.score.value,
        studios: {
          ...anime.studios,
          nodes: editedData.studio.value.split(',').map((name: string) => ({ name: name.trim() }))
        },
        description: editedData.plot.value,
        seasons: seasonData,
        artwork: artworkImages
      }

      const nfoContent = await generateNFO(updatedAnime, '')
      const zip = new JSZip()

      // Agregar el archivo NFO al ZIP
      zip.file('tvshow.nfo', nfoContent)

      // Agregar las imágenes de las temporadas al ZIP
      await addSeasonImagesToZip(zip)

      // Agregar las imágenes de artwork al ZIP
      await addArtworkImagesToZip(zip)

      // Generar y descargar el archivo ZIP
      const content = await zip.generateAsync({ type: 'blob' })
      saveAs(content, `${anime.title.romaji.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_metadata.zip`)

      toast({
        title: 'Saved successfully',
        description: 'Metadata and images have been packaged into a ZIP file for download.'
      })
    } catch (error) {
      console.error('Error saving data:', error)
      toast({
        title: 'Error',
        description: 'There was a problem saving the data. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsSaving(false)
    }
  }

  const addSeasonImagesToZip = async (zip: JSZip): Promise<void> => {
    for (let i = 0; i < seasonData.length; i++) {
      const season = seasonData[i]
      const seasonNumber = (i + 1).toString().padStart(2, '0')
      await addImageToZip(zip, season.poster, `season${seasonNumber}-poster.jpg`)
      await addImageToZip(zip, season.fanart, `season${seasonNumber}-fanart.jpg`)
      await addImageToZip(zip, season.banner, `season${seasonNumber}-banner.jpg`)
      await addImageToZip(zip, season.background, `season${seasonNumber}-landscape.jpg`)
    }
  }

  const addArtworkImagesToZip = async (zip: JSZip): Promise<void> => {
    const artworkTypes = ['poster', 'logo', 'clearart', 'fanart', 'background', 'characterart', 'banner']
    for (const type of artworkTypes) {
      const url = artworkImages[type as keyof typeof artworkImages]
      if (url) {
        await addImageToZip(zip, url, `${type}.jpg`)
      }
    }
  }

  const addImageToZip = async (zip: JSZip, url: string, filename: string): Promise<void> => {
    if (!url) return
    try {
      const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`
      const response = await fetch(proxyUrl)
      if (!response.ok) throw new Error('Network response was not ok')
      const blob = await response.blob()
      zip.file(filename, blob)
    } catch (error) {
      console.error(`Error adding ${filename} to ZIP:`, error)
    }
  }

  const FieldSelector = ({ field, label, options, isTextArea = false }: any): JSX.Element => {
    if (isTextArea) {
      return (
        <div className='space-y-2'>
          <Label>{label}</Label>
          <div className='space-y-2'>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  className='w-full justify-between font-mono'
                  disabled={loading}
                >
                  {editedData[field as keyof typeof editedData].source.toUpperCase()}
                  <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-full p-0'>
                <div className='space-y-2 p-2'>
                  {options.map((option: any) => (
                    <div
                      key={option.source}
                      className='flex items-center space-x-2 p-2 hover:bg-accent cursor-pointer'
                      onClick={() => {
                        setEditedData(prev => ({
                          ...prev,
                          [field]: {
                            value: option.value,
                            source: option.source
                          }
                        }))
                      }}
                    >
                      <Check
                        className={cn(
                          'h-4 w-4',
                          editedData[field as keyof typeof editedData].source === option.source ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      <div className='flex-1'>
                        <p className='text-sm font-medium font-mono'>{option.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            <Textarea
              value={editedData[field as keyof typeof editedData].value}
              onChange={(e) => {
                setEditedData(prev => ({
                  ...prev,
                  [field]: {
                    value: e.target.value,
                    source: editedData[field as keyof typeof editedData].source
                  }
                }))
              }}
              className='min-h-[200px] font-mono'
              disabled={loading}
            />
          </div>
          <div className='text-xs text-muted-foreground'>
            Source: <span className='font-mono'>{editedData[field as keyof typeof editedData].source}</span>
          </div>
        </div>
      )
    }

    return (
      <div className='space-y-2'>
        <Label>{label}</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              role='combobox'
              className={cn(
                'w-full justify-between font-mono',
                !editedData[field as keyof typeof editedData].value && 'text-muted-foreground'
              )}
              disabled={loading}
            >
              {editedData[field as keyof typeof editedData].value || 'Select value...'}
              <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-full p-0'>
            <div className='space-y-2 p-2'>
              {options.map((option: any) => (
                <div
                  key={option.source}
                  className='flex items-center space-x-2 p-2 hover:bg-accent cursor-pointer'
                  onClick={() => {
                    setEditedData(prev => ({
                      ...prev,
                      [field]: {
                        value: option.value,
                        source: option.source
                      }
                    }))
                  }}
                >
                  <Check
                    className={cn(
                      'h-4 w-4',
                      editedData[field as keyof typeof editedData].source === option.source ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <div className='flex-1'>
                    <p className='text-sm font-medium'>{option.label}</p>
                    <p className='text-sm text-muted-foreground font-mono'>{option.value}</p>
                  </div>
                </div>
              ))}
              <Input
                placeholder='Custom value...'
                value={editedData[field as keyof typeof editedData].source === 'custom' ? editedData[field as keyof typeof editedData].value : ''}
                onChange={(e) => {
                  setEditedData(prev => ({
                    ...prev,
                    [field]: {
                      value: e.target.value,
                      source: 'custom'
                    }
                  }))
                }}
                className='mt-2 font-mono'
                disabled={loading}
              />

            </div>
          </PopoverContent>
        </Popover>
        <div className='text-xs text-muted-foreground'>
          Source: <span className='font-mono'>{editedData[field as keyof typeof editedData].source}</span>
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto py-6'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-3xl font-bold'>{anime.title.romaji}</h1>
        <Button
          onClick={async () => await handleSave()}
          disabled={loading || isSaving}
        >
          {isSaving
            ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Generating ZIP...
              </>
              )
            : (
              <>
                <Download className='mr-2 h-4 w-4' />
                Save and Download ZIP
              </>
              )}
        </Button>
      </div>

      <Tabs defaultValue='information'>
        <TabsList>
          <TabsTrigger
            value='information'
            disabled={loading}
          >Information
          </TabsTrigger>
          <TabsTrigger
            value='extended'
            disabled={loading}
          >Extended
          </TabsTrigger>
          <TabsTrigger
            value='artwork'
            disabled={loading}
          >Artwork
          </TabsTrigger>
          <TabsTrigger
            value='seasons'
            disabled={loading}
          >Seasons
          </TabsTrigger>
        </TabsList>

        <TabsContent value='information'>
          <Card>
            <CardContent className='p-5 space-y-6'>
              <div className='grid grid-cols-2 gap-4'>
                <FieldSelector
                  field='title'
                  label='Title'
                  options={getProviderOptions('title')}
                />
                <FieldSelector
                  field='startDate'
                  label='Start Date'
                  options={getProviderOptions('startDate')}
                />
                <FieldSelector
                  field='originalTitle'
                  label='Original Title'
                  options={getProviderOptions('originalTitle')}
                />
                <FieldSelector
                  field='status'
                  label='Status'
                  options={getProviderOptions('status')}
                />
                <FieldSelector
                  field='duration'
                  label='Duration'
                  options={getProviderOptions('duration')}
                />
                <FieldSelector
                  field='score'
                  label='Score'
                  options={getProviderOptions('score')}
                />
              </div>

              <FieldSelector
                field='studio'
                label='Studio'
                options={getProviderOptions('studio')}
              />

              <FieldSelector
                field='plot'
                label='Plot'
                options={getProviderOptions('plot')}
                isTextArea
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='extended'>
          <Card>
            <CardContent className='p-5'>
              <div className='flex flex-col gap-4'>
                <div>
                  <Label
                    htmlFor='actors'
                    className='text-lg font-semibold mb-2'
                  >Personajes y Actores de Doblaje
                  </Label>
                  <div className='rounded-md border'>
                    <div className='w-full'>
                      <table className='w-full'>
                        <thead className='bg-muted'>
                          <tr>
                            <th className='h-12 px-4 text-left align-middle'>Character</th>
                            <th className='h-12 px-4 text-left align-middle'>Actor</th>
                          </tr>
                        </thead>
                      </table>
                    </div>
                    <div className='max-h-[400px] overflow-auto'>
                      <table className='w-full'>
                        <tbody>
                          {anime.characters.edges.map((character, index) => (
                            <tr
                              key={index}
                              className='border-t border-muted hover:bg-muted/50'
                            >
                              <td className='p-4 align-middle'>
                                <div className='flex gap-4 items-center'>
                                  <Image
                                    src={character.node.image.medium}
                                    alt={character.node.name.full}
                                    width={40}
                                    height={40}
                                    className='rounded-md'
                                  />
                                  {character.node.name.full}
                                </div>
                              </td>
                              <td className='p-4 align-middle'>
                                <div className='flex gap-4 items-center'>
                                  <Image
                                    src={character.voiceActors[0]?.image.medium}
                                    alt={character.voiceActors[0]?.name.full}
                                    width={40}
                                    height={40}
                                    className='rounded-md'
                                  />
                                  {character.voiceActors[0]?.name.full}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor='genres'>Géneros</Label>
                  <div className='flex flex-wrap gap-2'>
                    {anime.genres.map((genre, index) => (
                      <Badge
                        key={index}
                        variant='secondary'
                        className='cursor-pointer'
                      >
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor='tags'>Etiquetas</Label>
                  <div className='flex flex-wrap gap-2'>
                    {anime.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant='outline'
                        className='cursor-pointer'
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='artwork'>
          <Card>
            <CardContent className='space-y-6 px-7 grid grid-cols-2 items-center justify-center'>
              <div>
                <AnimeInfoArt
                  anime={anime}
                  providerData={providerData}
                  type='poster'
                  onImageSelect={(newImage: string) => {
                    setArtworkImages(prev => ({ ...prev, poster: newImage }))
                  }}
                >
                  <Image
                    src={artworkImages.poster || anime.coverImage.extraLarge}
                    alt='Poster Image'
                    width={200}
                    height={280}
                    className='rounded-lg'
                  />
                </AnimeInfoArt>
              </div>
              <div className='flex flex-col gap-4'>
                <div>
                  <AnimeInfoArt
                    anime={anime}
                    providerData={providerData}
                    type='logo'
                    onImageSelect={(newImage: string) => {
                      setArtworkImages(prev => ({ ...prev, logo: newImage }))
                    }}
                  >
                    <Image
                      src={artworkImages.logo || '/placeholder.svg'}
                      alt='Logo Image'
                      width={200}
                      height={280}
                      className='rounded-lg'
                    />
                  </AnimeInfoArt>
                </div>
                <div>
                  <AnimeInfoArt
                    anime={anime}
                    providerData={providerData}
                    type='clearart'
                    onImageSelect={(newImage: string) => {
                      setArtworkImages(prev => ({ ...prev, clearart: newImage }))
                    }}
                  >
                    <Image
                      src={artworkImages.clearart || '/placeholder.svg'}
                      alt='Clear art Image'
                      width={200}
                      height={280}
                      className='rounded-lg'
                    />
                  </AnimeInfoArt>
                </div>
              </div>
              <div className='flex flex-col gap-4'>
                <div>
                  <AnimeInfoArt
                    anime={anime}
                    providerData={providerData}
                    type='fanart'
                    onImageSelect={(newImage: string) => {
                      setArtworkImages(prev => ({ ...prev, fanart: newImage }))
                    }}
                  >
                    <Image
                      src={artworkImages.fanart || '/placeholder.svg'}
                      alt='Fanart Image'
                      width={200}
                      height={280}
                      className='rounded-lg'
                    />
                  </AnimeInfoArt>
                </div>
                <div>
                  <AnimeInfoArt
                    anime={anime}
                    providerData={providerData}
                    type='background'
                    onImageSelect={(newImage: string) => {
                      setArtworkImages(prev => ({ ...prev, background: newImage }))
                    }}
                  >
                    <Image
                      src={artworkImages.background || '/placeholder.svg'}
                      alt='Background Image'
                      width={200}
                      height={280}
                      className='rounded-lg'
                    />
                  </AnimeInfoArt>
                </div>
              </div>
              <div className='flex flex-col gap-4'>
                <div>
                  <AnimeInfoArt
                    anime={anime}
                    providerData={providerData}
                    type='characterart'
                    onImageSelect={(newImage: string) => {
                      setArtworkImages(prev => ({ ...prev, characterart: newImage }))
                    }}
                  >
                    <Image
                      src={artworkImages.characterart || '/placeholder.svg'}
                      alt='Character art Image'
                      width={800}
                      height={200}
                      className='rounded-lg w-full object-cover'
                    />
                  </AnimeInfoArt>
                </div>
                <div>
                  <AnimeInfoArt
                    anime={anime}
                    providerData={providerData}
                    type='banner'
                    onImageSelect={(newImage: string) => {
                      setArtworkImages(prev => ({ ...prev, banner: newImage }))
                    }}
                  >
                    <Image
                      src={artworkImages.banner || anime.bannerImage || '/placeholder.svg'}
                      alt='Banner Image'
                      width={800}
                      height={200}
                      className='rounded-lg w-full object-cover'
                    />
                  </AnimeInfoArt>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='seasons'>
          <AnimeInfoSeason
            anime={anime}
            providerData={providerData}
            onSeasonDataChange={setSeasonData}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
