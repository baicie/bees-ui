import { Component, EventEmitter, Prop, h, Event, State, Watch, Method, ComponentInterface } from '@stencil/core';
import useConfigInject from '@components/config-provider/hooks/use-config-inject';
import useStyle from './style';
import warning from '@utils/warning';
import { computed } from '@vue/reactivity';
import { CssClassMap } from '@utils/type';
@Component({
  tag: 'bees-button',
  shadow: true,
})
export class Button implements ComponentInterface {
  /**
   * If `true`, the user cannot interact with the button.
   */
  @Prop() disabled!: boolean;

  @Prop({ mutable: true, reflect: true }) type: 'primary' | 'default' | 'dashed' | 'link' | 'text' | 'ghost' =
    'default';

  @Prop({ reflect: true }) size: 'large' | 'middle' | 'small' = 'middle';

  @Prop() danger!: boolean;

  @State() innerLoading!: boolean;

  @Event() ikunFocus!: EventEmitter<void>;

  @Event() ikunClick!: EventEmitter<void>;

  @Watch('text')
  textChanged(text: string) {
    warning(true, text);
  }

  @Method()
  async handleFous() {
    this.ikunFocus.emit();
  }

  private handleClick = (ev: Event) => {
    if (!this.disabled) {
      ev.preventDefault();
      ev.stopImmediatePropagation();
      this.ikunClick.emit();
    }
  };

  render() {
    const { prefixCls, direction } = useConfigInject('btn', this);
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const classes = computed<CssClassMap>(() => {
      const { danger } = this;
      const pre = prefixCls.value;

      // const sizeClassNameMap = { large: 'lg', small: 'sm', middle: undefined };
      // const sizeFullname = compactSize.value || groupSizeContext?.size || size.value;
      // const sizeCls = sizeFullname ? sizeClassNameMap[sizeFullname] || '' : '';

      return {
        [hashId.value]: true,
        [`${pre}`]: true,
        // [`${pre}-${shape}`]: shape !== 'default' && shape,
        // [`${pre}-${type}`]: type,
        // [`${pre}-${sizeCls}`]: sizeCls,
        // [`${pre}-loading`]: innerLoading.value,
        // [`${pre}-background-ghost`]: ghost && !isUnBorderedButtonType(type),
        // [`${pre}-two-chinese-chars`]: hasTwoCNChar.value && autoInsertSpace.value,
        // [`${pre}-block`]: block,
        [`${pre}-dangerous`]: !!danger,
        [`${pre}-rtl`]: direction.value === 'rtl',
      };
    });

    const buttonProps = {
      class: classes.value,
      onClick: this.handleClick,
    };

    let buttonNode = (
      <button {...buttonProps}>
        <slot></slot>
      </button>
    );

    buttonNode = <bees-wave>{buttonNode}</bees-wave>;

    return wrapSSR(buttonNode);
  }
}
