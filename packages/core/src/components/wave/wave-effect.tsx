import { Component, Host, h, Element, State, Prop } from '@stencil/core';
import wrapperRaf from '../../utils/raf';

@Component({
  tag: 'bees-wave-effect',
  shadow: true,
})
export class WaveEffect {
  private resizeObserver: ResizeObserver;
  private rafId: number;
  private timeouteId: any;

  @Element() el!: HTMLElement;

  @Prop() target: HTMLElement;
  @Prop() myClassName: string;

  @State() enabled: boolean;

  private syncPos = () => {};

  private clear = () => {
    clearTimeout(this.timeouteId);
    wrapperRaf.cancel(this.rafId);
    this.resizeObserver?.disconnect();
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
      console.log('removeDom');
    }, 5000);

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

  disconnectedCallback() {
    this.clear();
  }

  render() {
    return (
      <Host>
        <div class={this.myClassName}></div>
      </Host>
    );
  }
}
