import { NextResponse } from 'next/server'

const TVDB_API_KEY = process.env.TVDB_API_KEY
const TVDB_BASE_URL = 'https://api4.thetvdb.com/v4'

interface TVDBAuthResponse {
  status: string
  data: {
    token: string
  }
}

interface TVDBSearchResponse {
  status: string
  data: any // Using any here since the actual response structure varies
}

async function getTVDBToken (): Promise<string> {
  try {
    const response = await fetch(`${TVDB_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        apikey: TVDB_API_KEY
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('TVDB Auth Error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      })
      throw new Error(`TVDB Auth failed: ${response.status} ${response.statusText}`)
    }

    const data: TVDBAuthResponse = await response.json()
    return data.data.token
  } catch (error) {
    console.error('Error getting TVDB token:', error)
    throw error
  }
}

async function searchTVDB (id: string, token: string): Promise<any | null> {
  try {
    const url = `${TVDB_BASE_URL}/series/${id}/extended?meta=episodes`

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('TVDB Search Error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      })
      return null
    }

    const responseData: TVDBSearchResponse = await response.json()
    // Return just the data property directly
    return responseData.data
  } catch (error) {
    console.error('Error searching TVDB:', error)
    return null
  }
}

export async function GET (request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!TVDB_API_KEY) {
      return NextResponse.json(
        { error: 'TVDB API key not configured' },
        { status: 500 }
      )
    }

    if (!id) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }

    const token = await getTVDBToken()
    const searchResult = await searchTVDB(id, token)

    if (!searchResult) {
      return NextResponse.json({
        error: 'No results found'
      }, { status: 404 })
    }

    return NextResponse.json(searchResult)
  } catch (error) {
    console.error('Error in TVDB endpoint:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch data from TVDB'
      },
      { status: 500 }
    )
  }
}
