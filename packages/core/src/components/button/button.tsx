import { Component, EventEmitter, Host, Prop, h, Event, State, Watch, Method, ComponentInterface } from '@stencil/core';
import warning from '../../utils/warning';

@Component({
  tag: 'bees-button',
  styleUrl: 'button.scss',
  shadow: true,
})
export class Button implements ComponentInterface {
  private buttonRef: HTMLButtonElement | undefined;
  /**
   * If `true`, the user cannot interact with the button.
   */
  @Prop() disabled: boolean;

  @Prop({ mutable: true, reflect: true }) type: 'primary' | 'default' | 'dashed' | 'link' | 'text' | 'ghost' =
    'default';

  @Prop({ reflect: true }) size: 'large' | 'middle' | 'small' = 'middle';

  @Prop() danger: boolean;

  @State() text: string;
  @State() innerLoading: boolean;

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
      this.text = 'textChanged';
      console.log('buttonRef', this.buttonRef);
    }
  };

  buttonProps = {
    onClick: this.handleClick,
  };

  buttonNode = (
    <button {...this.buttonProps} ref={(buttonRef) => (this.buttonRef = buttonRef)}>
      <slot></slot>
    </button>
  );

  render() {
    return (
      <Host>
        <bees-wave disabled={this.innerLoading}>{this.buttonNode}</bees-wave>
      </Host>
    );
  }
}
