import useConfigInject from '@components/config-provider/hooks/use-config-inject';
import { Component, ComponentInterface, Prop, h, EventEmitter, Event } from '@stencil/core';
import { computed } from '@vue/reactivity';
import classNames from 'classnames';
import useStyle from './style';
import { ButtonHTMLType, ButtonShape, ButtonType, Loading } from './buttonHelpers';
import { SizeType } from '@components/config-provider/context';
import { MouseEventHandler } from '@utils/EventInterface';
import { useCompactItemContext } from '@components/space/Compact';
import { GroupSizeContext } from './button-group';
@Component({
  tag: 'bees-button',
})
export class Button implements ComponentInterface {
  @Prop({ reflect: true, mutable: true }) type: ButtonType;

  @Prop({ reflect: true }) size: SizeType = 'default';

  @Prop({ reflect: true }) loading: Loading;

  @Prop({ reflect: true }) disabled: boolean;

  @Prop({ reflect: true }) ghost: boolean;

  @Prop({ reflect: true }) block: boolean;

  @Prop({ reflect: true }) danger: boolean;

  @Prop({ reflect: true }) shape: ButtonShape;

  @Prop({ reflect: true }) prefixCls: string;

  @Prop({ reflect: true }) htmlType: ButtonHTMLType;

  @Prop({ reflect: true }) icon: string;

  @Prop({ reflect: true }) target: string;

  @Prop({ reflect: true }) href: string;

  @Prop({}) beeTitle: string;

  @Event({}) beeClick: EventEmitter<MouseEventHandler>;

  @Event({}) beeMousedown: EventEmitter<MouseEventHandler>;

  render() {
    const { prefixCls, direction, size } = useConfigInject('btn', this);
    const { compactSize, compactItemClassnames } = useCompactItemContext(prefixCls, direction);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const groupSizeContext = GroupSizeContext.useInject();

    const classes = computed(() => {
      const { type, shape = 'default', ghost, block, danger } = this;
      const pre = prefixCls.value;

      const sizeClassNameMap = { large: 'lg', small: 'sm', middle: undefined };
      const sizeFullname = compactSize.value || groupSizeContext?.size || size.value;
      const sizeCls = sizeFullname ? sizeClassNameMap[sizeFullname] || '' : '';

      return classNames(compactItemClassnames.value, {
        [hashId.value]: true,
        [`${pre}`]: true,
        [`${pre}-${shape}`]: shape !== 'default' && shape,
        [`${pre}-${type}`]: type,
        [`${pre}-${sizeCls}`]: sizeCls,
        [`${pre}-loading`]: innerLoading.value,
        [`${pre}-background-ghost`]: ghost && !isUnBorderedButtonType(type),
        [`${pre}-two-chinese-chars`]: hasTwoCNChar.value && autoInsertSpace.value,
        [`${pre}-block`]: block,
        [`${pre}-dangerous`]: !!danger,
        [`${pre}-rtl`]: direction.value === 'rtl',
      });
    });

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
