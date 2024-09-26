import { FloatButton } from '@bees-ui/antd'
import type { FloatButtonProps } from '@bees-ui/antd'
import register from '@bees-ui/register'

export type { FloatButtonProps }

export const beesFloatButtonProps: FloatButtonProps = {
  prefixCls: undefined,
  type: 'default',
  className: undefined,
  rootClassName: undefined,
  icon: undefined,
  htmlType: undefined,
  style: {},
  href: undefined,
  description: undefined,
  shape: 'square',
  tooltip: undefined,
  target: undefined,
  badge: undefined,
  'aria-label': undefined,
}

export default function registerFloatButton() {
  register('bees-float-button', FloatButton, beesFloatButtonProps)
}
