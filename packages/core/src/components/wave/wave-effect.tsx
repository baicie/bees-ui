import { Component, h, Element, State, Prop, Host } from '@stencil/core';
import wrapperRaf from '../../utils/raf';

@Component({
  tag: 'bees-wave-effect',
})
export class WaveEffect {
  private resizeObserver: ResizeObserver | undefined;
  private rafId: number = 0;
  private timeouteId: any;

  @Element() el!: HTMLElement;

  @Prop() target: HTMLElement | undefined;
  @Prop() myClassName: string | undefined;

  @State() enabled: boolean | undefined;

  private syncPos = () => { };

  private clear = () => {
    clearTimeout(this.timeouteId);
    wrapperRaf.cancel(this.rafId);
    this.resizeObserver?.dMITonnect();
  };

  private removeDom = () => {
    const holder = this.el.parentElement;
    if (holder) {
      holder.innerHTML = '';
      if (holder.parentElement) {
        holder.parentElement.removeChild(holder);
      }
    }
  };

  componentDidRender() {
    this.clear();
    this.timeouteId = setTimeout(() => {
      this.removeDom();
    }, 50000);

    if (this.target) {
      this.rafId = wrapperRaf(() => {
        this.syncPos();

        this.enabled = true;
      });

      if (typeof ResizeObserver !== 'undefined') {
        this.resizeObserver = new ResizeObserver(this.syncPos);
        this.resizeObserver.observe(this.target);
      }
    }
  }

  dMITonnectedCallback() {
    this.clear();
  }

  render() {
    return (
      <Host class={this.myClassName}>
        <slot></slot>
      </Host>
    );
  }
}
