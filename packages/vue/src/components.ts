/* eslint-disable */
/* tslint:disable */
/* auto-generated vue proxies */
import { defineContainer } from './vue-component-lib/utils';

import type { JSX } from '@bees-ui/core';

import { defineCustomElement as defineBeesButton } from '@bees-ui/core/components/bees-button.js';
import { defineCustomElement as defineBeesWave } from '@bees-ui/core/components/bees-wave.js';
import { defineCustomElement as defineBeesWaveEffect } from '@bees-ui/core/components/bees-wave-effect.js';
import { defineCustomElement as defineIkunConfigProvider } from '@bees-ui/core/components/ikun-config-provider.js';
import { defineCustomElement as defineIkunLocaleProvider } from '@bees-ui/core/components/ikun-locale-provider.js';
import { defineCustomElement as defineMyComponent } from '@bees-ui/core/components/my-component.js';


export const BeesButton = /*@__PURE__*/ defineContainer<JSX.BeesButton>('bees-button', defineBeesButton, [
  'disabled',
  'type',
  'size',
  'danger',
  'ikunFocus',
  'ikunClick'
]);


export const BeesWave = /*@__PURE__*/ defineContainer<JSX.BeesWave>('bees-wave', defineBeesWave, [
  'disabled'
]);


export const BeesWaveEffect = /*@__PURE__*/ defineContainer<JSX.BeesWaveEffect>('bees-wave-effect', defineBeesWaveEffect, [
  'target',
  'myClassName'
]);


export const IkunConfigProvider = /*@__PURE__*/ defineContainer<JSX.IkunConfigProvider>('ikun-config-provider', defineIkunConfigProvider, [
  'componentSize',
  'theme',
  'locale'
]);


export const IkunLocaleProvider = /*@__PURE__*/ defineContainer<JSX.IkunLocaleProvider>('ikun-locale-provider', defineIkunLocaleProvider, [
  'locale'
]);


export const MyComponent = /*@__PURE__*/ defineContainer<JSX.MyComponent>('my-component', defineMyComponent, [
  'first',
  'middle',
  'last'
]);

