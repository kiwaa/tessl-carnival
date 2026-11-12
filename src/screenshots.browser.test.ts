import { expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { palette } from './midway/palette';

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

it('draws the red hot air balloon whole, high in the sky', () => {
  const canvas = document.querySelector<HTMLCanvasElement>('canvas.midway-map')!;
  const { width, height } = canvas;
  const pixels = canvas.getContext('2d')!.getImageData(0, 0, width, height).data;
  const at = (x: number, y: number) =>
    pixels.subarray((y * width + x) * 4, (y * width + x) * 4 + 3);
  const red = [1, 3, 5].map((i) => parseInt(palette.red.slice(i, i + 2), 16));
  const isRed = (x: number, y: number) =>
    at(x, y).every((channel, i) => Math.abs(channel - red[i]) <= 8);

  // The horizon is where the grass starts at the left edge. The upper half of
  // the sky holds only sky, clouds and the balloon: tents and the wheel stay lower.
  let horizon = 0;
  while (horizon < height && !isGrass(at(0, horizon))) horizon++;
  let balloon = 0;
  for (let y = 0; y < horizon / 2; y++) {
    for (let x = 0; x < width; x++) if (isRed(x, y)) balloon++;
  }
  expect(horizon).toBeGreaterThan(0);
  expect(balloon).toBeGreaterThan(50);

  // The top row is clear, so the balloon is not cut off by the top of the map.
  const topRow = Array.from({ length: width }, (_, x) => isRed(x, 0));
  expect(topRow).not.toContain(true);
});

function isGrass([r, g, b]: Uint8ClampedArray): boolean {
  return g > r && g > b;
}

it('screenshots the water cannon', async () => {
  await show('#/play/water-cannon');

  expect(document.body.dataset.view).toBe('game');
  await page.screenshot({ path: '../screenshots/water-cannon.png' });
});
