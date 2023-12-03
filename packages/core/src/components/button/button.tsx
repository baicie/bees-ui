import { Component, EventEmitter, Prop, h, Event, State, Watch, Method, ComponentInterface } from '@stencil/core';
import warning from '../../utils/warning';
import useConfigInject from '@components/config-provider/hooks/use-config-inject';

@Component({
  tag: 'bees-button',
  shadow: true,
})
export class Button implements ComponentInterface {
  private buttonRef: HTMLButtonElement | undefined;
  private config = useConfigInject('btn', this);
  private style = useStyle(this.config.prefixCls);
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
    const buttonProps = {
      onClick: this.handleClick,
    };

    const buttonNode = (
      <button {...buttonProps} ref={(buttonRef) => (this.buttonRef = buttonRef)}>
        <slot></slot>
      </button>
    );
    return <bees-wave disabled={this.innerLoading}>{buttonNode}</bees-wave>;
  }
}
