import { Component, EventEmitter, Host, Prop, h ,Event, State, Watch, Method, Listen} from '@stencil/core';
import warning from '../../utils/warning';

@Component({
  tag: 'ikun-button',
  styleUrl: 'button.scss',
  shadow: true,
})
export class BButton {
  /**
   * If `true`, the user cannot interact with the button.
   */
  @Prop() disabled: boolean;

  @Prop() type: 'primary' | 'default' | 'dashed' | 'link' | 'text' | 'ghost' = 'default';

  @Prop() size: 'large' | 'middle' | 'small' = 'middle';

  @Prop() danger: boolean;

  @State() text: string;

  @Event() ikunFocus!: EventEmitter<void>;

  @Event() ikunClick!: EventEmitter<void>;

  @Listen('click')
  handleClick2() {
    warning(true, 'handleClick2');
  }


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
    }
  }

  render() {
    return (
      <Host
        onClick={this.handleClick}
      >
        <slot></slot>
      </Host>
    );
  }
}
