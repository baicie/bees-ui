import { newE2EPage } from '@stencil/core/testing';

describe('ikun-locale-provider', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ikun-locale-provider></ikun-locale-provider>');

    const element = await page.find('ikun-locale-provider');
    expect(element).toHaveClass('hydrated');
  });
});
