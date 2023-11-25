import { Component, Host, Prop, h } from '@stencil/core';
import { SizeType, ThemeConfig } from './context';

@Component({
  tag: 'config-provider',
})
export class ConfigProvider {
  @Prop({}) componentSize: SizeType

  @Prop() theme: ThemeConfig

  render() {
    return (
      <Host>
        ConfigProvider2
        <slot></slot>
      </Host>
    );
  }

}
