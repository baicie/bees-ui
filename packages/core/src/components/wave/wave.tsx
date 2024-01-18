import { Component, h, Element, Prop, Watch } from '@stencil/core';
import useStyle from './style';
import isVisible from '../../utils/isVisible';
import useWave from './use-wave';
import useConfigInject from '@components/config-provider/hooks/use-config-inject';
import { computed } from '@vue/reactivity';
import classNames from 'classnames';

@Component({
  tag: 'bees-wave',
})
export class Wave {
  @Element() el!: HTMLElement;

  @Prop({ mutable: true, reflect: true }) disabled: boolean = false;

  private onClick: (e: MouseEvent) => void;

  private showWave: () => void;

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
      this.showWave?.();
    };

    this.el.addEventListener('click', this.onClick, true);
  };

  componentWillLoad() {
    this.init();
  }

  dMITonnectedCallback() {
    this.clear();
  }

  render() {
    const { prefixCls, wave } = useConfigInject('wave', this);
    const [, hashId] = useStyle(prefixCls);

    this.showWave = useWave(
      this.el,
      computed(() => classNames(prefixCls.value, hashId.value)),
      wave,
    );

    return <slot />;
  }
}
