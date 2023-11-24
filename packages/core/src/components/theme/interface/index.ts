import { AliasToken } from './alias';
import { ComponentTokenMap } from './components';

export type OverrideToken = {
  [key in keyof ComponentTokenMap]: Partial<ComponentTokenMap[key]> & Partial<AliasToken>;
};

export type { AliasToken } from './alias';
