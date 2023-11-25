/* eslint-disable */
/* tslint:disable */
/* auto-generated vue proxies */
import { defineContainer } from './vue-component-lib/utils';

import type { JSX } from '@ikunorg/core/components';

import { defineCustomElement as defineConfigProvider } from '@ikunorg/core/components/config-provider.js';
import { defineCustomElement as defineIkunButton } from '@ikunorg/core/components/ikun-button.js';
import { defineCustomElement as defineIkunWave } from '@ikunorg/core/components/ikun-wave.js';
import { defineCustomElement as defineMyComponent } from '@ikunorg/core/components/my-component.js';


export const ConfigProvider = /*@__PURE__*/ defineContainer<JSX.ConfigProvider>('config-provider', defineConfigProvider, [
  'componentSize',
  'theme'
]);


export const IkunButton = /*@__PURE__*/ defineContainer<JSX.IkunButton>('ikun-button', defineIkunButton, [
  'disabled'
]);


export const IkunWave = /*@__PURE__*/ defineContainer<JSX.IkunWave>('ikun-wave', defineIkunWave, [
  'disabled'
]);


export const MyComponent = /*@__PURE__*/ defineContainer<JSX.MyComponent>('my-component', defineMyComponent, [
  'first',
  'middle',
  'last'
]);

