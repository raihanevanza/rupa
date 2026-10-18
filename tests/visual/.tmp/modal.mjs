import { chromium } from '@playwright/test'
const D = process.argv[2]
const b = await chromium.launch()
for (const [w, h, name] of [[1280, 900, 'desk'], [390, 844, 'phone']]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, storageState: `${D}/dr-state.json`, deviceScaleFactor: name === 'phone' ? 2 : 1 })
  await ctx.addInitScript(() => localStorage.setItem('theme', 'light'))
  const p = await ctx.newPage()
  p.on('pageerror', (e) => console.log('pageerror', e.message))
  if (name === 'phone') {
    await p.goto('http://localhost:5199/', { waitUntil: 'networkidle' }); await p.waitForTimeout(800)
    await p.screenshot({ path: `${D}/m-${name}-home.png` })
  }
  await p.goto('http://localhost:5199/transaksi', { waitUntil: 'networkidle' }); await p.waitForTimeout(600)
  await p.getByRole('button', { name: 'Catat', exact: true }).first().click()
  await p.waitForTimeout(500)
  const dlg = p.getByRole('dialog')
  console.log(name, 'dialog visible', await dlg.isVisible(), 'focused in dialog', await p.evaluate(() => !!document.activeElement?.closest('[role=dialog]')))
  await p.screenshot({ path: `${D}/m-${name}-modal.png` })
  await p.keyboard.press('Escape'); await p.waitForTimeout(300)
  console.log(name, 'closed by Esc', !(await dlg.isVisible().catch(() => false)), 'focus back on', await p.evaluate(() => document.activeElement?.textContent?.trim()))
  await ctx.close()
}
await b.close()
