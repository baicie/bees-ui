import { Component, Host, h, Element, State, Prop, Watch } from '@stencil/core';

import isVisible from '../../utils/isVisible';

@Component({
  tag: 'ikun-wave',
  shadow: true,
})
export class IkunWave {
  @Element() el!: HTMLElement;

  @Prop() disabled: boolean;

  @State() onClick: (e: MouseEvent) => void;

  @Watch('disabled')
  disabledChanged() {
    this.clear();
    this.init();
  }

  private clear = () => {
    this.el.removeEventListener('click', this.onClick, true);
  };

  private init = () => {
    this.onClick = (e: MouseEvent) => {
      if (
        (e.target as HTMLElement).tagName === 'INPUT' ||
        !isVisible(e.target as HTMLElement) ||
        !this.el.getAttribute ||
        this.el.getAttribute('disabled') ||
        (this.el as HTMLInputElement).disabled ||
        this.el.className.includes('disabled') ||
        this.el.className.includes('-leave')
      ) {
        return;
      }
    };

    this.el.addEventListener('click', this.onClick, true);
  };

  componentWillLoad() {
    this.init();
  }

  disconnectedCallback() {
    this.clear();
  }

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
