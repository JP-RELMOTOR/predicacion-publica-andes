import { readFileSync, writeFileSync } from 'fs'
import { Resvg } from '@resvg/resvg-js'

const dir = new URL('./public/', import.meta.url)
const svg = readFileSync(new URL('icon.svg', dir), 'utf8')

const targets = [
  { name: 'icon-512.png', size: 512 },
  { name: 'icon-192.png', size: 192 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'favicon-32.png', size: 32 },
]

for (const t of targets) {
  const r = new Resvg(svg, { fitTo: { mode: 'width', value: t.size } })
  const png = r.render().asPng()
  writeFileSync(new URL(t.name, dir), png)
  console.log('OK', t.name, png.length, 'bytes')
}
