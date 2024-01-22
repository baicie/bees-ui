import { button } from './button';
import Element from '@baicie/register';

class SolidButton extends Element {
  static props: any = {
    loading: false,
    prefixCls: undefined,
    type: 'default',
    danger: undefined,
    shape: 'default',
    size: undefined,
    styles: undefined,
    disabled: undefined,
    className: undefined,
    rootClassName: undefined,
    icon: undefined,
    ghost: false,
    block: false,
    htmlType: 'button',
    classNames: undefined,
  };

  render() {
    // @ts-ignore
    console.log('this.', this.props);

    // @ts-ignore
    return button(this);
  }
}

customElements.define('solid-button', SolidButton);
