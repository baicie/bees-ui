import { Component, Host, Prop, h } from '@stencil/core';

@Component({
  tag: 'ikun-button',
  styleUrl: 'button.scss',
  shadow: true,
})
export class BButton {
  /**
   * If `true`, the user cannot interact with the button.
   */
  @Prop() disabled: boolean;
  render() {
    return (
      <Host>
        ikun
        <slot></slot>
      </Host>
    );
  }
}
