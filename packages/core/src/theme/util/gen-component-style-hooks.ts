import { ComponentTokenMap } from '../interface/components';
import { UseComponentStyleResult } from '../internal';

export type OverrideTokenWithoutDerivative = ComponentTokenMap;
export type OverrideComponent = keyof OverrideTokenWithoutDerivative;

export default function genComponentStyleHook<ComponentName extends OverrideComponent>(
  component: ComponentName,
  styleFn: (tokens: OverrideTokenWithoutDerivative[ComponentName]) => string,
) {
  return (prefixCls: string): UseComponentStyleResult => {};
}
