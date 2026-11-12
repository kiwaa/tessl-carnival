import { expect, it } from 'vitest';
import { page } from 'vitest/browser';

// Takes a screenshot of each view into screenshots/, for CI to attach to the
// pull request. It checks only that each view drew, not how it looks.

function frames(count: number): Promise<void> {
  return new Promise((resolve) => {
    const next = (left: number) =>
      left === 0 ? resolve() : requestAnimationFrame(() => next(left - 1));
    next(count);
  });
}

async function show(hash: string): Promise<void> {
  location.hash = hash;
  await frames(10);
}

it('screenshots the midway', async () => {
  document.body.innerHTML = `
    <header class="awning"><a class="brand" href="#/">Tessl Carnival</a></header>
    <main id="app"></main>`;
  location.hash = '#/';
  await import('./main');
  await frames(10);

  expect(document.body.dataset.view).toBe('midway');
  await page.screenshot({ path: '../screenshots/midway.png' });
});

it('screenshots the water cannon', async () => {
  await show('#/play/water-cannon');

  expect(document.body.dataset.view).toBe('game');
  await page.screenshot({ path: '../screenshots/water-cannon.png' });
});
