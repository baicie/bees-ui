import useConfigInject from '@components/config-provider/hooks/use-config-inject';
import { Component, ComponentInterface, Prop, h, EventEmitter, Event } from '@stencil/core';
import { computed } from '@vue/reactivity';
import classNames from 'classnames';
import useStyle from './style';
import { ButtonHTMLType, ButtonShape, ButtonType, Loading } from './button-helpers';
import { SizeType } from '@components/config-provider/context';
import { MouseEventHandler } from '@utils/EventInterface';
@Component({
  tag: 'bees-button',
})
export class Button implements ComponentInterface {
  @Prop({ reflect: true, mutable: true }) type!: ButtonType;

  @Prop({ reflect: true }) size: SizeType = 'default';

  @Prop({ reflect: true }) loading!: Loading;

  @Prop({ reflect: true }) disabled!: boolean;

  @Prop({ reflect: true }) ghost!: boolean;

  @Prop({ reflect: true }) block!: boolean;

  @Prop({ reflect: true }) danger!: boolean;

  @Prop({ reflect: true }) shape!: ButtonShape;

  @Prop({ reflect: true }) prefixCls!: string;

  @Prop({ reflect: true }) htmlType!: ButtonHTMLType;

  @Prop({ reflect: true }) icon!: string;

  @Prop({ reflect: true }) target!: string;

  @Prop({ reflect: true }) href!: string;

  @Prop({}) beeTitle!: string;

  @Event({}) beeClick!: EventEmitter<MouseEventHandler>;

  @Event({}) beeMousedown!: EventEmitter<MouseEventHandler>;

  render() {
    const { prefixCls, direction } = useConfigInject('btn', this);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const { danger, type } = this;

    const classes = computed(() =>
      classNames(prefixCls.value, hashId.value, {
        [`${prefixCls.value}-${type}`]: type,
        [`${prefixCls.value}-dangerous`]: !!danger,
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
      }),
    );

    const buttonProps = {
      class: classes.value,
    };

    let buttonNode = (
      <button {...buttonProps}>
        <bees-wave>
          <slot></slot>
        </bees-wave>
      </button>
    );

    return wrapSSR(buttonNode);
  }
}
