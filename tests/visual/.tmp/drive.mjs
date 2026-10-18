// Ad-hoc browser driver: node drive.mjs <script.json-ish via argv>
import { chromium } from '@playwright/test'
const [url, out, mode = 'light', w = '1280', h = '860'] = process.argv.slice(2)
const b = await chromium.launch()
const ctx = await b.newContext({ viewport: { width: +w, height: +h }, colorScheme: mode })
const p = await ctx.newPage()
p.on('pageerror', (e) => console.log('pageerror', e.message))
p.on('console', (m) => m.type() === 'error' && console.log('console', m.text().slice(0, 200)))
await p.goto(url, { waitUntil: 'networkidle' })
await p.waitForTimeout(600)
await p.screenshot({ path: out, fullPage: true })
console.log('title', await p.title(), 'h1', await p.locator('h1').allTextContents())
await b.close()
