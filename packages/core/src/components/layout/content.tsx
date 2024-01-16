import { useConfigInject } from '@components/config-provider';
import { Component, ComponentInterface, Prop, h } from '@stencil/core';

@Component({
  tag: 'bees-layout-content',
})
export class Header implements ComponentInterface {
  @Prop({ reflect: true }) prefixCls: string;

  @Prop({ reflect: true }) hasSider: boolean = false;

  @Prop({ reflect: true }) beTagName: string;

  render() {
    const { prefixCls } = useConfigInject('layout-content', this);
    return (
      <main class={prefixCls.value}>
        <slot></slot>
      </main>
    );
  }
}
