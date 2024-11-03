import { NextResponse } from 'next/server'

const API_KEY = '22ad50f5'

export async function GET (request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')

  if (!query) {
    return NextResponse.json({ error: 'query is required' }, { status: 400 })
  }

  try {
    const response = await fetch(`http://www.omdbapi.com/?t=${query}&plot=full&apikey=${API_KEY}`)
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching from OMDB:', error)
    return NextResponse.json({ error: 'Failed to fetch from OMDB' }, { status: 500 })
  }
}