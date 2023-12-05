import { SizeType } from '@components/config-provider/size-context';
import { Component, ComponentInterface, Host, h } from '@stencil/core';
import createContext from '@utils/createContext';

@Component({
  tag: 'bees-button-group',
})
export class ButtonGroup implements ComponentInterface {
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}

export const GroupSizeContext = createContext<{
  size: SizeType;
}>();
