import { Button } from '@bees-ui/antd';
import register from '@bees-ui/register';
import type { FunctionComponent } from 'preact';

export { ButtonProps } from '@bees-ui/antd';

export default function registerButton() {
  register(Button as FunctionComponent, 'bees-button', [
    'type',
    'size',
    'disabled',
    'loading',
    'icon',
    'shape',
    'block',
    'href',
    'target',
    'htmlType',
    'onClick',
  ]);
}
