import { Component, ComponentInterface, Host, h } from '@stencil/core';

@Component({
  tag: 'bees-button-group',
})
export class ButtonGroup implements ComponentInterface {
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
