/* eslint-disable */
/* tslint:disable */
/* auto-generated vue proxies */
import { defineContainer } from './vue-component-lib/utils';

import type { JSX } from '@bees-ui/core';

import { defineCustomElement as defineBeesButton } from '@bees-ui/core/components/bees-button.js';
import { defineCustomElement as defineBeesConfigProvider } from '@bees-ui/core/components/bees-config-provider.js';
import { defineCustomElement as defineBeesLayout } from '@bees-ui/core/components/bees-layout.js';
import { defineCustomElement as defineBeesWave } from '@bees-ui/core/components/bees-wave.js';
import { defineCustomElement as defineBeesWaveEffect } from '@bees-ui/core/components/bees-wave-effect.js';
import { defineCustomElement as defineIkunLocaleProvider } from '@bees-ui/core/components/ikun-locale-provider.js';


export const BeesButton = /*@__PURE__*/ defineContainer<JSX.BeesButton>('bees-button', defineBeesButton, [
  'type',
  'size',
  'loading',
  'disabled',
  'ghost',
  'block',
  'danger',
  'shape',
  'prefixCls',
  'htmlType',
  'icon',
  'target',
  'href',
  'beeTitle',
  'beeClick',
  'beeMousedown'
]);


export const BeesConfigProvider = /*@__PURE__*/ defineContainer<JSX.BeesConfigProvider>('bees-config-provider', defineBeesConfigProvider, [
  'componentSize',
  'theme',
  'locale'
]);


export const BeesLayout = /*@__PURE__*/ defineContainer<JSX.BeesLayout>('bees-layout', defineBeesLayout);


export const BeesWave = /*@__PURE__*/ defineContainer<JSX.BeesWave>('bees-wave', defineBeesWave, [
  'disabled'
]);


export const BeesWaveEffect = /*@__PURE__*/ defineContainer<JSX.BeesWaveEffect>('bees-wave-effect', defineBeesWaveEffect, [
  'target',
  'myClassName'
]);


export const IkunLocaleProvider = /*@__PURE__*/ defineContainer<JSX.IkunLocaleProvider>('ikun-locale-provider', defineIkunLocaleProvider, [
  'locale'
]);

