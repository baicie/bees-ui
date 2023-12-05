import { newSpecPage } from '@stencil/core/testing';
import { Button } from '../button';

describe('baicie-button', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [Button],
      html: `<baicie-button></baicie-button>`,
    });
    expect(page.root).toEqualHtml(`
      <baicie-button>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </baicie-button>
    `);
  });
});
