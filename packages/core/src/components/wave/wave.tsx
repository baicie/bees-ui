import { Component, Host, Prop, h } from '@stencil/core';

@Component({
  tag: 'ikun-wave',
  shadow: true,
})
export class IWave {
  constructor() {

  }
  /**
   * 是否禁用
   * If `true`, the user cannot interact with the button.
   */
  @Prop() disabled: boolean;
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
