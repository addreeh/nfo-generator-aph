/* eslint-disable @typescript-eslint/restrict-template-expressions */
export function generateNFO (anime: any, images: any): string {
  console.log('Datos de entrada del anime:', anime)
  const currentDate = new Date().toISOString().split('T')[0]

  const indent = (level: number): string => '  '.repeat(level)

  let nfo = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<tvshow>
${indent(1)}<plot>${anime.description?.replace(/<[^>]*>?/gm, '')}</plot>
${indent(1)}<outline>${anime.description?.replace(/<[^>]*>?/gm, '')}</outline>
${indent(1)}<lockdata>false</lockdata>
${indent(1)}<dateadded>${currentDate}</dateadded>
${indent(1)}<title>${anime.title.romaji}</title>
${indent(1)}<originaltitle>${anime.title.native}</originaltitle>
${indent(1)}<trailer>${anime.trailer?.site === 'youtube' ? `plugin://plugin.video.youtube/play/?video_id=${anime.trailer.id}` : ''}</trailer>
${indent(1)}<rating>${anime.averageScore}</rating>
${indent(1)}<year>${anime.startDate?.year}</year>
${indent(1)}<sorttitle>${anime.title.romaji}</sorttitle>
${indent(1)}<runtime>${anime.duration}</runtime>
${indent(1)}<mpaa>${anime.isAdult ? 'R18+' : 'NR'}</mpaa>

${indent(1)}<imdb_id>${anime.imdbId || ''}</imdb_id>
${indent(1)}<tmdbid>${anime.tmdbId || ''}</tmdbid>
${indent(1)}<anilistid>${anime.id}</anilistid>
${indent(1)}<tvmazeid>${anime.tvmazeId || ''}</tvmazeid>
${indent(1)}<tvdbid>${anime.tvdbId || ''}</tvdbid>

${indent(1)}<language>es</language>
${indent(1)}<countrycode>ES</countrycode>
${indent(1)}<premiered>${anime.startDate ? `${anime.startDate.year}-${String(anime.startDate.month).padStart(2, '0')}-${String(anime.startDate.day).padStart(2, '0')}` : ''}</premiered>
${indent(1)}<releasedate>${anime.startDate ? `${anime.startDate.year}-${String(anime.startDate.month).padStart(2, '0')}-${String(anime.startDate.day).padStart(2, '0')}` : ''}</releasedate>
${indent(1)}<enddate>${anime.endDate ? `${anime.endDate.year}-${String(anime.endDate.month).padStart(2, '0')}-${String(anime.endDate.day).padStart(2, '0')}` : ''}</enddate>
`

  // Géneros
  anime.genres?.forEach((genre: string) => {
    nfo += `${indent(1)}<genre>${genre}</genre>\n`
  })

  // Estudios
  anime.studios?.nodes?.forEach((studio: { name: string }) => {
    nfo += `${indent(1)}<studio>${studio.name}</studio>\n`
  })

  // Tags
  anime.tags?.forEach((tag: { name: string }) => {
    nfo += `${indent(1)}<tag>${tag.name}</tag>\n`
  })

  // Actores
  anime.characters?.edges?.forEach((actor: any, index: number) => {
    nfo += `${indent(1)}<actor>
${indent(2)}<name>${actor.voiceActors?.[0]?.name?.full || 'N/A'}</name>
${indent(2)}<role>${actor.node?.name?.full || 'N/A'}</role>
${indent(2)}<type>Actor</type>
${indent(2)}<sortorder>${index}</sortorder>
${indent(2)}<thumb>${actor.voiceActors?.[0]?.image?.medium || ''}</thumb>
${indent(1)}</actor>
`
  })

  // Status
  nfo += `${indent(1)}<status>${anime.status}</status>

${indent(1)}<uniqueid default="true" type="tmdb">${anime.tmdbId || ''}</uniqueid>
${indent(1)}<uniqueid type="imdb">${anime.imdbId || ''}</uniqueid>
${indent(1)}<uniqueid type="tvmaze">${anime.tvmazeId || ''}</uniqueid>
${indent(1)}<uniqueid type="tvdb">${anime.tvdbId || ''}</uniqueid>

${indent(1)}<ratings>
${indent(2)}<rating name="imdb" default="true" max="10">
${indent(3)}<value>${anime.imdbRating || ''}</value>
${indent(3)}<votes>${anime.imdbVotes || ''}</votes>
${indent(2)}</rating>
${indent(1)}</ratings>
`

  // Temporadas
  anime.seasons?.forEach((season: any, index: number) => {
    nfo += `${indent(1)}<namedseason number="${index}">${season.name || ''}</namedseason>\n`
  })

  // Imágenes
  nfo += `${indent(1)}<thumb aspect="poster" preview="${anime.coverImage.medium}">${anime.coverImage.medium}</thumb>\n`
  if (images?.fanart) {
    nfo += `${indent(1)}<thumb aspect="fanart" preview="${images.fanart}">${images.fanart}</thumb>\n`
  }
  if (images?.banner) {
    nfo += `${indent(1)}<thumb aspect="banner" preview="${images.banner}">${images.banner}</thumb>\n`
  }

  nfo += '</tvshow>'

  console.log('NFO final generado:', nfo)
  return nfo
}
