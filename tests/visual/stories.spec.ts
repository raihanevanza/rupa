import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'

interface Entry {
  id: string
  title: string
  name: string
  type: 'story' | 'docs'
  tags: string[]
}

const index = JSON.parse(
  readFileSync(new URL('../../apps/docs/storybook-static/index.json', import.meta.url), 'utf8'),
) as { entries: Record<string, Entry> }

const stories = Object.values(index.entries).filter(
  (e) => e.type === 'story' && e.tags.includes('visual'),
)
const modes = ['light', 'dark'] as const

for (const story of stories) {
  for (const mode of modes) {
    test(`${story.title} / ${story.name} (${mode})`, async ({ page }) => {
      // Overlays (dialogs, toasts) render in a portal, so they are captured as a full page.
      const fullPage = story.tags.includes('visual-page')
      await page.goto(
        `/iframe.html?id=${story.id}&viewMode=story&globals=theme:${mode};brand:violet`,
      )
      await page.waitForFunction((m) => document.documentElement.dataset.theme === m, mode)
      // Wait for the story to render; portal-only stories (toasts) render outside the root.
      await page.waitForFunction(
        () =>
          document.querySelector('#storybook-root')?.childElementCount ||
          document.querySelector('[role="dialog"], [role="alertdialog"], .rupa-toast'),
      )
      await page.evaluate(() => document.fonts.ready)
      // Play functions may open overlays or move focus; let them finish.
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(150)

      const name = `${story.id}--${mode}.png`
      if (fullPage) await expect(page).toHaveScreenshot(name)
      else await expect(page.locator('#storybook-root')).toHaveScreenshot(name)
    })
  }
}
