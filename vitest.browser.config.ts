import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

// Screenshots of the carnival in headless Chromium. Run with npm run test:browser
// after npx playwright install chromium. CI runs it on pull requests only.
export default defineConfig({
  base: './',
  test: {
    include: ['src/**/*.browser.test.ts'],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
      viewport: { width: 1280, height: 800 },
      screenshotFailures: false,
    },
  },
});
