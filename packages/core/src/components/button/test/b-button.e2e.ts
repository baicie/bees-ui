import { newE2EPage } from '@stencil/core/testing';

describe('baicie-button', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<baicie-button></baicie-button>');

    const element = await page.find('baicie-button');
    expect(element).toHaveClass('hydrated');
  });
});
