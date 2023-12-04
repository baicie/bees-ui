import { Component, ComponentInterface, Host, h } from '@stencil/core';

@Component({
  tag: 'bees-layout',
  shadow: true,
})
export class Layout implements ComponentInterface {
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
