import { Component, Host, Prop, h } from '@stencil/core';

@Component({
  tag: 'baicie-button',
  styleUrl: 'button.scss',
  shadow: true,
})
export class BButton {
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
