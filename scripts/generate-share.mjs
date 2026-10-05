import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const root = process.cwd()
const cutout = path.join(root, 'assets-src/me-cutout.png')
const output = path.join(root, 'public/share.jpg')
try {
  await fs.access(cutout)
} catch {
  console.log('Skipping share image: assets-src/me-cutout.png is missing')
  process.exit(0)
}

const text = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><text x="76" y="294" fill="#0E0E0E" font-family="Arial, sans-serif" font-size="74" font-weight="700">Tanmay Jain</text><text x="80" y="354" fill="#4D4B47" font-family="Arial, sans-serif" font-size="26" font-weight="600">AI/ML + Full-Stack Developer</text></svg>`)
const portrait = await sharp(cutout).resize({ width: 600, height: 620, fit: 'inside' }).png().toBuffer()
await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#ECEAE5' } })
  .composite([{ input: portrait, left: 600, top: 630 - (await sharp(portrait).metadata()).height }, { input: text }])
  .jpeg({ quality: 88, mozjpeg: true, progressive: true })
  .toFile(output)
console.log(`Wrote ${path.relative(root, output)}`)
