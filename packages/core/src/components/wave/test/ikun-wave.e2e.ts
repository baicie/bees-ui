import { newE2EPage } from '@stencil/core/testing';

describe('ikun-wave', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ikun-wave></ikun-wave>');

    const element = await page.find('ikun-wave');
    expect(element).toHaveClass('hydrated');
  });
});
