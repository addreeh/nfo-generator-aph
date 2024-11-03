import { NextResponse } from 'next/server'
import { AniListAnime } from '@/types'

export async function GET (request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')
  const type = searchParams.get('type')
  const formats = searchParams.get('formats')?.split(',') ?? []

  if (!query || !type) {
    return NextResponse.json({ error: 'Query and type are required' }, { status: 400 })
  }

  try {
    const animeList = await searchAnime(query, type, formats)
    return NextResponse.json(animeList)
  } catch (error) {
    console.error('Error in searchAnime API route:', error)
    return NextResponse.json({ error: 'Failed to search anime' }, { status: 500 })
  }
}

async function searchAnime (query: string, type: string, formats: string[] = []): Promise<AniListAnime[]> {
  if (!query.trim()) {
    return []
  }

  const response = await fetch('https://graphql.anilist.co/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      query: `
        query ($search: String, $type: MediaType!, $formats: [MediaFormat]) {
          Page(page: 1, perPage: 10) {
            media(search: $search, type: $type, format_in: $formats) {
              id
              idMal
              title {
                romaji
                english
                native
              }
              coverImage {
                medium
                extraLarge
              }
              bannerImage
              startDate {
                year
                month
                day
              }
              endDate {
                year
                month
                day
              }
              description
              season
              seasonYear
              type
              format
              status(version: 2)
              episodes
              duration
              chapters
              volumes
              genres
              isAdult
              averageScore
              popularity
              studios(isMain: true) {
                nodes {
                  name
                }
              }
              tags {
                name
              }
              trailer {
                id
                site
              }
              characters(sort: ROLE, perPage: 10) {
                edges {
                  node {
                    name {
                      full
                      native
                    }
                    image {
                      medium
                    }
                  }
                  voiceActors(language: JAPANESE) {
                    name {
                      full
                      native
                    }
                    image {
                      medium
                    }
                  }
                }
              }
            }
          }
        }
      `,
      variables: {
        search: query,
        type: type.toUpperCase(),
        formats: formats.length > 0 ? formats : undefined
      }
    })
  })

  if (!response.ok) {
    const errorData = await response.json()
    console.error('API Error Response:', errorData)
    throw new Error('Failed to fetch from AniList API')
  }

  const data = await response.json()

  if (!data) {
    throw new Error('No data received from API')
  }

  if (data.errors) {
    const errorMessage = data.errors.map((e: any) => e.message).join(', ')
    console.error('API Error Message:', errorMessage)
    throw new Error(errorMessage)
  }

  if (!data.data?.Page?.media) {
    throw new Error('Invalid API response structure')
  }

  return data.data.Page.media
}
