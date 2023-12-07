import type { Ref } from '@vue/reactivity';

export type SiderCollapsed = Ref<boolean>;

export const SiderCollapsedKey = Symbol('siderCollapsed');

export interface SiderHookProvider {
  addSider?: (id: string) => void;
  removeSider?: (id: string) => void;
}

export const SiderHookProviderKey = Symbol('siderHookProvider');
