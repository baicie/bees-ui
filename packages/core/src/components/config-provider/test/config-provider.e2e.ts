import { newE2EPage } from '@stencil/core/testing';

describe('config-provider', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<config-provider></config-provider>');

    const element = await page.find('config-provider');
    expect(element).toHaveClass('hydrated');
  });
});
