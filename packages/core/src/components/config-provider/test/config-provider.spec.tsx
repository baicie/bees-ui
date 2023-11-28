import { newSpecPage } from '@stencil/core/testing';
import { IkunConfigProvider } from '../config-provider';

describe('config-provider', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [IkunConfigProvider],
      html: `<config-provider></config-provider>`,
    });
    expect(page.root).toEqualHtml(`
      <config-provider>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </config-provider>
    `);
  });
});
