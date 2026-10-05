import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const root = process.cwd()
const publicDir = path.join(root, 'public')
const projectDir = path.join(publicDir, 'projects')
const sources = [path.join(publicDir, 'me.jpg')]
try {
  for (const name of await fs.readdir(projectDir)) if (/\.jpe?g$/i.test(name)) sources.push(path.join(projectDir, name))
} catch {}

for (const source of sources) {
  try {
    const metadata = await sharp(source).metadata()
    for (const width of [480, 800, 1200]) {
      if (!metadata.width || metadata.width <= width) continue
      const output = source.replace(/\.jpe?g$/i, `-${width}.webp`)
      await sharp(source).resize({ width }).webp({ quality: 82, effort: 6 }).toFile(output)
      console.log(`Wrote ${path.relative(root, output)}`)
    }
  } catch (error) {
    if (error.code === 'ENOENT') console.log(`Skipping missing image: ${path.relative(root, source)}`)
    else throw error
  }
}
