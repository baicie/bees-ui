import type { Locale } from '@baicie/core/src/locale';
import { Component, Prop, h } from '@stencil/core';

import type { SizeType, ThemeConfig } from './context';
import { useConfigContext } from './context';

@Component({
  tag: 'bees-config-provider',
})
export class ConfigProvider {
  @Prop({}) componentSize: SizeType;

  @Prop() theme!: ThemeConfig;

  @Prop() locale!: Locale;

  componentWillLoad() {
    useConfigContext.set('componentSize', this.componentSize);
    useConfigContext.set('theme', this.theme);
    useConfigContext.set('locale', this.locale);
  }

  render() {
    return (
      <ikun-locale-provider locale={this.locale}>
        <slot></slot>
      </ikun-locale-provider>
    );
  }
}
