import { Component, h, Element, Prop, Watch } from '@stencil/core';

import isVisible from '../../utils/isVisible';
import useWave from './use-wave';

@Component({
  tag: 'bees-wave',
  shadow: true,
})
export class Wave {
  @Element() el!: HTMLElement;

  @Prop() disabled: boolean = false;

  private onClick: (e: MouseEvent) => void;

  // private effectEls: HTMLElement[] = [];

  private showWave = useWave(this.el, 'btn-demo', {
    disabled: this.disabled,
  });

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
      this.showWave();
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
    return <slot></slot>;
  }
}
