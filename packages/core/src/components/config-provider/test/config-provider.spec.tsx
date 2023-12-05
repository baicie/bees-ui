import { newSpecPage } from '@stencil/core/testing';
import { ConfigProvider } from '../config-provider';

describe('config-provider', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ConfigProvider],
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
