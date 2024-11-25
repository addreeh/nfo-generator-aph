import { NextResponse } from 'next/server'
import { parseString } from 'xml2js'
import { promisify } from 'util'

const parseXML = promisify(parseString)

const ANIDB_API_URL = 'http://api.anidb.net:9001/httpapi'
const CLIENT = 'NFOGeneratorAPH'
const CLIENT_VERSION = 1
const PROTOCOL_VERSION = 1

export async function GET (request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url)
  const name = searchParams.get('name')

  if (!name) {
    return NextResponse.json({ error: 'Name parameter is required' }, { status: 400 })
  }

  try {
    const response = await fetch(
      `${ANIDB_API_URL}?request=anime&client=${CLIENT}&clientver=${CLIENT_VERSION}&protover=${PROTOCOL_VERSION}&name=${encodeURIComponent(name)}`,
      {
        headers: {
          'User-Agent': `${CLIENT}/${CLIENT_VERSION} (yourwebsite.com)`
        }
      }
    )

    if (!response.ok) {
      throw new Error(`AniDB API responded with status: ${response.status}`)
    }

    const xmlData = await response.text()
    const result: any = await parseXML(xmlData)

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    // Transformar y limpiar los datos según sea necesario
    const animeData = result.anime
      ? {
          id: result.anime.$.id,
          type: result.anime.type[0],
          episodecount: result.anime.episodecount[0],
          startdate: result.anime.startdate[0],
          enddate: result.anime.enddate[0],
          titles: result.anime.titles[0].title.map((title: any) => ({
            name: title._,
            type: title.$.type
          })),
          description: result.anime.description ? result.anime.description[0] : null,
          ratings: result.anime.ratings
            ? {
                permanent: result.anime.ratings[0].permanent[0],
                temporary: result.anime.ratings[0].temporary[0],
                review: result.anime.ratings[0].review[0]
              }
            : null
        }
      : null

    return NextResponse.json(animeData)
  } catch (error) {
    console.error('Error fetching from AniDB:', error)
    return NextResponse.json({ error: 'Failed to fetch data from AniDB' }, { status: 500 })
  }
}
