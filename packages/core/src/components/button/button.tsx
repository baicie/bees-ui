import { Component, EventEmitter, Prop, h, Event, State, Watch, Method, ComponentInterface, Host } from '@stencil/core';
import useConfigInject from '@components/config-provider/hooks/use-config-inject';
import useStyle from './style';
import warning from '@utils/warning';
import classNames from 'classnames';
import { computed } from '@vue/reactivity';
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
    const { danger, type } = this;

    const classes = computed(() =>
      classNames(prefixCls, hashId.value, {
        [`${prefixCls}-${type}`]: type,
        [`${prefixCls}-dangerous`]: !!danger,
        [`${prefixCls}-rtl`]: direction === 'rtl',
      }),
    );

    const buttonProps = {
      class: classes.value,
      onClick: this.handleClick,
    };

    let buttonNode = (
      <button>
        <slot></slot>
      </button>
    );

    buttonNode = (
      <Host {...buttonProps}>
        <bees-wave>{buttonNode}</bees-wave>
      </Host>
    );

    return wrapSSR(buttonNode);
  }
}
