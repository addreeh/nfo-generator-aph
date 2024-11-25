import { NextRequest, NextResponse } from 'next/server'

const FANART_BASE_URL = 'http://webservice.fanart.tv/v3'
const FANART_API_KEY = process.env.FANART_API_KEY

interface FanartTVResponse {
  name?: string
  id?: string
  hdtvlogo?: Array<{ url: string, lang: string }>
  hdclearart?: Array<{ url: string, lang: string }>
  seasonposter?: Array<{ url: string, lang: string, season: string }>
  tvposter?: Array<{ url: string, lang: string }>
  tvbanner?: Array<{ url: string, lang: string }>
  showbackground?: Array<{ url: string, lang: string }>
  characterart?: Array<{ url: string, lang: string }>
}

export async function GET (request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!FANART_API_KEY) {
      return NextResponse.json(
        { error: 'FanartTV API key not configured' },
        { status: 500 }
      )
    }

    if (!id) {
      return NextResponse.json(
        { error: 'Query or TVDB ID is required' },
        { status: 400 }
      )
    }

    if (id) {
      const response = await fetch(
        `${FANART_BASE_URL}/tv/${id}?api_key=${FANART_API_KEY}`,
        {
          headers: {
            Accept: 'application/json'
          }
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch from FanartTV')
      }

      const data: FanartTVResponse = await response.json()
      return NextResponse.json(data)
    }

    // Si solo tenemos el query, necesitaríamos primero buscar el TVDB ID
    // Aquí podrías agregar lógica adicional para buscar el TVDB ID usando otro servicio
    // Por ahora retornamos un error indicando que se necesita el TVDB ID
    return NextResponse.json(
      { error: 'TVDB ID is required for FanartTV lookup' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error fetching from FanartTV:', error)
    return NextResponse.json(
      { error: 'Failed to fetch data from FanartTV' },
      { status: 500 }
    )
  }
}
