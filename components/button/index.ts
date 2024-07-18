import register from 'preact-custom-element';

import Button, { InternalCompoundedButton } from './button';

export type { SizeType as ButtonSize } from '../config-provider/SizeContext';
export type { ButtonProps } from './button';
export type { ButtonGroupProps } from './button-group';

export * from './buttonHelpers';

export default Button;

register(InternalCompoundedButton, 'ant-button', ['type'], { shadow: false });
