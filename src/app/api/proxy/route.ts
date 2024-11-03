import { NextResponse } from 'next/server'
import fetch from 'node-fetch'

export async function GET (request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 })
  }

  try {
    const response = await fetch(url)
    const contentType = response.headers.get('content-type')
    const buffer = await response.arrayBuffer()

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType ?? 'application/octet-stream',
        'Access-Control-Allow-Origin': '*'
      }
    })
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json({ error: 'Failed to fetch the resource' }, { status: 500 })
  }
}
