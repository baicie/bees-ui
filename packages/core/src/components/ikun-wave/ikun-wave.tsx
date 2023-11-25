import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'ikun-wave',
  shadow: true,
})
export class IkunWave {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
