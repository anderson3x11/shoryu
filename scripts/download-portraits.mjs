import fs from 'fs'
import path from 'path'

const urls = JSON.parse(fs.readFileSync('scripts/portrait-urls.json', 'utf8'))

async function resolveImageUrl(filename) {
  const api = `https://streetfighter.fandom.com/api.php?action=query&titles=File:${encodeURIComponent(filename)}&prop=imageinfo&iiprop=url&format=json`
  const res = await fetch(api)
  const json = await res.json()
  const page = Object.values(json.query.pages)[0]
  if (!page.imageinfo) throw new Error(`No imageinfo for ${filename}`)
  return page.imageinfo[0].url
}

async function download(url, dest) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()))
}

for (const [id, galleryUrl] of Object.entries(urls)) {
  if (!galleryUrl) { console.log(`SKIP  ${id} (no url)`); continue }

  const match = galleryUrl.match(/[?&]file=([^&#]+)/)
  if (!match) { console.log(`SKIP  ${id} (can't parse filename)`); continue }

  const filename = decodeURIComponent(match[1])
  const dest = path.join('public', 'characters', `${id}.png`)

  try {
    process.stdout.write(`${id.padEnd(12)} ${filename} ... `)
    const imageUrl = await resolveImageUrl(filename)
    await download(imageUrl, dest)
    console.log('✓')
  } catch (e) {
    console.log(`✗  ${e.message}`)
  }

  await new Promise(r => setTimeout(r, 250))
}
