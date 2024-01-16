import { useConfigInject } from '@components/config-provider';
import { Component, ComponentInterface, Prop, State, h } from '@stencil/core';
import useStyle from './style';
import { shallowRef } from '@vue/reactivity';
import classNames from 'classnames';

export type SpinSize = 'small' | 'default' | 'large';

function shouldDelay(spinning?: boolean, delay?: number): boolean {
  return !!spinning && !!delay && !isNaN(Number(delay));
}

@Component({
  tag: 'bees-spin',
})
export class Spin implements ComponentInterface {
  @Prop() prefixCls: string;

  @Prop() spinning: boolean = true;

  @Prop() size: SpinSize = 'default';

  @Prop() tip: any;

  @Prop() wrapperClassName: string = '';

  @Prop() delay: number = 0;

  @Prop() indicator: any;

  @State() config = useConfigInject('spin', this);

  @State() style = useStyle(this.config.prefixCls);

  @State() sSpinning = shallowRef(this.spinning && !shouldDelay(this.spinning, this.delay));

  @State() updateSpinning: any;
  render() {
    const [wrapSSR, hashId] = this.style;
    const { prefixCls, size, direction } = this.config;
    const spinClassName = {
      [hashId.value]: true,
      [prefixCls.value]: true,
      [`${prefixCls.value}-sm`]: size.value === 'small',
      [`${prefixCls.value}-lg`]: size.value === 'large',
      [`${prefixCls.value}-spinning`]: this.sSpinning,
      // [`${prefixCls.value}-show-text`]: !!tip,
      [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
      // [cls as string]: !!cls,
    };

    function renderIndicator(prefixCls: string) {
      const dotClassName = `${prefixCls}-dot`;
      // let indicator = getPropsSlot(slots, props, 'indicator');
      // // should not be render default indicator when indicator value is null
      // if (indicator === null) {
      //   return null;
      // }
      // if (Array.isArray(indicator)) {
      //   indicator = indicator.length === 1 ? indicator[0] : indicator;
      // }
      // if (isVNode(indicator)) {
      //   return cloneVNode(indicator, { class: dotClassName });
      // }

      // if (defaultIndicator && isVNode(defaultIndicator())) {
      //   return cloneVNode(defaultIndicator(), { class: dotClassName });
      // }

      return (
        <span class={`${dotClassName} ${prefixCls}-dot-spin`}>
          <i class={`${prefixCls}-dot-item`} />
          <i class={`${prefixCls}-dot-item`} />
          <i class={`${prefixCls}-dot-item`} />
          <i class={`${prefixCls}-dot-item`} />
        </span>
      );
    }
    const spinElement = (
      <div class={classNames(spinClassName)} aria-live="polite" aria-busy={this.sSpinning.value}>
        {renderIndicator(prefixCls.value)}
        {this.tip ? <div class={`${prefixCls.value}-text`}>{this.tip}</div> : null}
      </div>
    );

    return wrapSSR(spinElement);
  }
}
