import { Button } from '@bees-ui/antd'
import type { ButtonProps } from '@bees-ui/antd'
import register from '@bees-ui/register'

export type { ButtonProps }

export const beesButtonProps: ButtonProps = {
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
  htmlType: undefined,
  classNames: undefined,
  style: {},
  href: undefined,
  autoInsertSpace: false,
}

export default function registerButton() {
  register('bees-button', Button, beesButtonProps)
}
