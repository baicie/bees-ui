/* eslint-disable */
/* tslint:disable */
/* auto-generated vue proxies */
import { defineContainer } from './vue-component-lib/utils';

import type { JSX } from '@ikunorg/core';

import { defineCustomElement as defineIkunButton } from '@ikunorg/core/components/ikun-button.js';
import { defineCustomElement as defineIkunConfigProvider } from '@ikunorg/core/components/ikun-config-provider.js';
import { defineCustomElement as defineIkunLocaleProvider } from '@ikunorg/core/components/ikun-locale-provider.js';
import { defineCustomElement as defineIkunWave } from '@ikunorg/core/components/ikun-wave.js';
import { defineCustomElement as defineMyComponent } from '@ikunorg/core/components/my-component.js';


export const IkunButton = /*@__PURE__*/ defineContainer<JSX.IkunButton>('ikun-button', defineIkunButton, [
  'disabled',
  'type',
  'size',
  'danger',
  'ikunFocus',
  'ikunClick'
]);


export const IkunConfigProvider = /*@__PURE__*/ defineContainer<JSX.IkunConfigProvider>('ikun-config-provider', defineIkunConfigProvider, [
  'componentSize',
  'theme',
  'locale'
]);


export const IkunLocaleProvider = /*@__PURE__*/ defineContainer<JSX.IkunLocaleProvider>('ikun-locale-provider', defineIkunLocaleProvider, [
  'locale'
]);


export const IkunWave = /*@__PURE__*/ defineContainer<JSX.IkunWave>('ikun-wave', defineIkunWave, [
  'disabled'
]);


export const MyComponent = /*@__PURE__*/ defineContainer<JSX.MyComponent>('my-component', defineMyComponent, [
  'first',
  'middle',
  'last'
]);

