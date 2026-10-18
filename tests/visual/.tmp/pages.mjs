import { chromium } from '@playwright/test'
const [D, mode, ...routes] = process.argv.slice(2)
const b = await chromium.launch()
const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, storageState: `${D}/dr-state.json`, colorScheme: mode })
await ctx.addInitScript((m) => localStorage.setItem('theme', m), mode)
const p = await ctx.newPage()
p.on('pageerror', (e) => console.log('pageerror', e.message))
p.on('console', (m) => m.type() === 'error' && console.log('console', m.text().slice(0, 160)))
for (const r of routes) {
  await p.goto(`http://localhost:5199${r}`, { waitUntil: 'networkidle' })
  await p.waitForTimeout(900)
  const name = r === '/' ? 'home' : r.replace(/\//g, '')
  await p.screenshot({ path: `${D}/pg-${mode}-${name}.png`, fullPage: false })
  console.log(mode, r, 'h1:', (await p.locator('h1').allTextContents()).join('|'))
}
await b.close()
