import { Component, ComponentInterface, Host, h } from '@stencil/core';

@Component({
  tag: 'bees-layout',
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
