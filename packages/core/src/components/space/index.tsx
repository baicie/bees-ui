import { Component, ComponentInterface, Host, h } from '@stencil/core';

@Component({
  tag: 'bees-space',
})
export class Space implements ComponentInterface {
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
