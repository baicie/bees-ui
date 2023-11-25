import { newSpecPage } from '@stencil/core/testing';
import { IkunWave } from '../ikun-wave';

describe('ikun-wave', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [IkunWave],
      html: `<ikun-wave></ikun-wave>`,
    });
    expect(page.root).toEqualHtml(`
      <ikun-wave>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ikun-wave>
    `);
  });
});
