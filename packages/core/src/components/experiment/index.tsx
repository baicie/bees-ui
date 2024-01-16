import { ComponentInterface, Component, h } from '@stencil/core';
import { Hello } from './Hellow';

@Component({
  tag: 'bees-experiment',
})
export class Experiment implements ComponentInterface {
  render() {
    return (
      <Hello name="demo">
        <div>
          first
          <slot name="first"></slot>
        </div>
        <slot name="second"></slot>
        <slot name="third"></slot>
      </Hello>
    );
  }
}
