/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { ButtonHTMLType, ButtonShape, ButtonType, Loading } from "./components/button/buttonHelpers";
import { SizeType } from "./components/config-provider/context";
import { MouseEventHandler } from "./utils/EventInterface";
import { SizeType as SizeType1, ThemeConfig } from "./components/config-provider/context";
import { Locale } from "@bees-ui/core/src/locale";
import { CSSProperties } from "csstype";
import { Locale as Locale1 } from "./locale";
import { SpinSize } from "./components/spin/Spin";
export { ButtonHTMLType, ButtonShape, ButtonType, Loading } from "./components/button/buttonHelpers";
export { SizeType } from "./components/config-provider/context";
export { MouseEventHandler } from "./utils/EventInterface";
export { SizeType as SizeType1, ThemeConfig } from "./components/config-provider/context";
export { Locale } from "@bees-ui/core/src/locale";
export { CSSProperties } from "csstype";
export { Locale as Locale1 } from "./locale";
export { SpinSize } from "./components/spin/Spin";
export namespace Components {
    interface BeesButton {
        "beeTitle": string;
        "block": boolean;
        "danger": boolean;
        "disabled": boolean;
        "ghost": boolean;
        "href": string;
        "htmlType": ButtonHTMLType;
        "icon": string;
        "loading": Loading;
        "prefixCls": string;
        "shape": ButtonShape;
        "size": SizeType;
        "target": string;
        "type": ButtonType;
    }
    interface BeesButtonGroup {
    }
    interface BeesConfigProvider {
        "componentSize": SizeType1;
        "locale": Locale;
        "theme": ThemeConfig;
    }
    interface BeesExperiment {
    }
    interface BeesLayout {
        "beTagName": string;
        "hasSider": boolean;
        "prefixCls": string;
    }
    interface BeesLayoutContent {
        "beTagName": string;
        "hasSider": boolean;
        "prefixCls": string;
    }
    interface BeesLayoutFooter {
        "beTagName": string;
        "hasSider": boolean;
        "prefixCls": string;
    }
    interface BeesLayoutHeader {
        "beTagName": string;
        "hasSider": boolean;
        "prefixCls": string;
    }
    interface BeesLayoutSider {
        "breakpoint": 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
        "collapsed": boolean;
        "collapsedWidth": number | string;
        "collapsible": boolean;
        "defaultCollapsed": boolean;
        "prefixCls": string;
        "reverseArrow": boolean;
        "theme": 'light' | 'dark';
        "trigger": any;
        "width": number | string;
        "zeroWidthTriggerStyle": CSSProperties;
    }
    interface BeesLocaleProvider {
        "locale": Locale1 | undefined;
    }
    interface BeesSpace {
    }
    interface BeesSpin {
        "delay": number;
        "indicator": any;
        "prefixCls": string;
        "size": SpinSize;
        "spinning": boolean;
        "tip": any;
        "wrapperClassName": string;
    }
    interface BeesWave {
        "disabled": boolean;
    }
    interface BeesWaveEffect {
        "myClassName": string | undefined;
        "target": HTMLElement | undefined;
    }
}
export interface BeesButtonCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLBeesButtonElement;
}
export interface BeesLayoutSiderCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLBeesLayoutSiderElement;
}
declare global {
    interface HTMLBeesButtonElementEventMap {
        "beeClick": MouseEventHandler;
        "beeMousedown": MouseEventHandler;
    }
    interface HTMLBeesButtonElement extends Components.BeesButton, HTMLStencilElement {
        addEventListener<K extends keyof HTMLBeesButtonElementEventMap>(type: K, listener: (this: HTMLBeesButtonElement, ev: BeesButtonCustomEvent<HTMLBeesButtonElementEventMap[K]>) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
        removeEventListener<K extends keyof HTMLBeesButtonElementEventMap>(type: K, listener: (this: HTMLBeesButtonElement, ev: BeesButtonCustomEvent<HTMLBeesButtonElementEventMap[K]>) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
    }
    var HTMLBeesButtonElement: {
        prototype: HTMLBeesButtonElement;
        new (): HTMLBeesButtonElement;
    };
    interface HTMLBeesButtonGroupElement extends Components.BeesButtonGroup, HTMLStencilElement {
    }
    var HTMLBeesButtonGroupElement: {
        prototype: HTMLBeesButtonGroupElement;
        new (): HTMLBeesButtonGroupElement;
    };
    interface HTMLBeesConfigProviderElement extends Components.BeesConfigProvider, HTMLStencilElement {
    }
    var HTMLBeesConfigProviderElement: {
        prototype: HTMLBeesConfigProviderElement;
        new (): HTMLBeesConfigProviderElement;
    };
    interface HTMLBeesExperimentElement extends Components.BeesExperiment, HTMLStencilElement {
    }
    var HTMLBeesExperimentElement: {
        prototype: HTMLBeesExperimentElement;
        new (): HTMLBeesExperimentElement;
    };
    interface HTMLBeesLayoutElement extends Components.BeesLayout, HTMLStencilElement {
    }
    var HTMLBeesLayoutElement: {
        prototype: HTMLBeesLayoutElement;
        new (): HTMLBeesLayoutElement;
    };
    interface HTMLBeesLayoutContentElement extends Components.BeesLayoutContent, HTMLStencilElement {
    }
    var HTMLBeesLayoutContentElement: {
        prototype: HTMLBeesLayoutContentElement;
        new (): HTMLBeesLayoutContentElement;
    };
    interface HTMLBeesLayoutFooterElement extends Components.BeesLayoutFooter, HTMLStencilElement {
    }
    var HTMLBeesLayoutFooterElement: {
        prototype: HTMLBeesLayoutFooterElement;
        new (): HTMLBeesLayoutFooterElement;
    };
    interface HTMLBeesLayoutHeaderElement extends Components.BeesLayoutHeader, HTMLStencilElement {
    }
    var HTMLBeesLayoutHeaderElement: {
        prototype: HTMLBeesLayoutHeaderElement;
        new (): HTMLBeesLayoutHeaderElement;
    };
    interface HTMLBeesLayoutSiderElementEventMap {
        "beesBreakpoint": { broken: boolean };
        "beesCollapse": { collapsed: boolean; type: 'clickTrigger' | 'responsive' };
    }
    interface HTMLBeesLayoutSiderElement extends Components.BeesLayoutSider, HTMLStencilElement {
        addEventListener<K extends keyof HTMLBeesLayoutSiderElementEventMap>(type: K, listener: (this: HTMLBeesLayoutSiderElement, ev: BeesLayoutSiderCustomEvent<HTMLBeesLayoutSiderElementEventMap[K]>) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
        removeEventListener<K extends keyof HTMLBeesLayoutSiderElementEventMap>(type: K, listener: (this: HTMLBeesLayoutSiderElement, ev: BeesLayoutSiderCustomEvent<HTMLBeesLayoutSiderElementEventMap[K]>) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
    }
    var HTMLBeesLayoutSiderElement: {
        prototype: HTMLBeesLayoutSiderElement;
        new (): HTMLBeesLayoutSiderElement;
    };
    interface HTMLBeesLocaleProviderElement extends Components.BeesLocaleProvider, HTMLStencilElement {
    }
    var HTMLBeesLocaleProviderElement: {
        prototype: HTMLBeesLocaleProviderElement;
        new (): HTMLBeesLocaleProviderElement;
    };
    interface HTMLBeesSpaceElement extends Components.BeesSpace, HTMLStencilElement {
    }
    var HTMLBeesSpaceElement: {
        prototype: HTMLBeesSpaceElement;
        new (): HTMLBeesSpaceElement;
    };
    interface HTMLBeesSpinElement extends Components.BeesSpin, HTMLStencilElement {
    }
    var HTMLBeesSpinElement: {
        prototype: HTMLBeesSpinElement;
        new (): HTMLBeesSpinElement;
    };
    interface HTMLBeesWaveElement extends Components.BeesWave, HTMLStencilElement {
    }
    var HTMLBeesWaveElement: {
        prototype: HTMLBeesWaveElement;
        new (): HTMLBeesWaveElement;
    };
    interface HTMLBeesWaveEffectElement extends Components.BeesWaveEffect, HTMLStencilElement {
    }
    var HTMLBeesWaveEffectElement: {
        prototype: HTMLBeesWaveEffectElement;
        new (): HTMLBeesWaveEffectElement;
    };
    interface HTMLElementTagNameMap {
        "bees-button": HTMLBeesButtonElement;
        "bees-button-group": HTMLBeesButtonGroupElement;
        "bees-config-provider": HTMLBeesConfigProviderElement;
        "bees-experiment": HTMLBeesExperimentElement;
        "bees-layout": HTMLBeesLayoutElement;
        "bees-layout-content": HTMLBeesLayoutContentElement;
        "bees-layout-footer": HTMLBeesLayoutFooterElement;
        "bees-layout-header": HTMLBeesLayoutHeaderElement;
        "bees-layout-sider": HTMLBeesLayoutSiderElement;
        "bees-locale-provider": HTMLBeesLocaleProviderElement;
        "bees-space": HTMLBeesSpaceElement;
        "bees-spin": HTMLBeesSpinElement;
        "bees-wave": HTMLBeesWaveElement;
        "bees-wave-effect": HTMLBeesWaveEffectElement;
    }
}
declare namespace LocalJSX {
    interface BeesButton {
        "beeTitle"?: string;
        "block"?: boolean;
        "danger"?: boolean;
        "disabled"?: boolean;
        "ghost"?: boolean;
        "href"?: string;
        "htmlType"?: ButtonHTMLType;
        "icon"?: string;
        "loading"?: Loading;
        "onBeeClick"?: (event: BeesButtonCustomEvent<MouseEventHandler>) => void;
        "onBeeMousedown"?: (event: BeesButtonCustomEvent<MouseEventHandler>) => void;
        "prefixCls"?: string;
        "shape"?: ButtonShape;
        "size"?: SizeType;
        "target"?: string;
        "type"?: ButtonType;
    }
    interface BeesButtonGroup {
    }
    interface BeesConfigProvider {
        "componentSize"?: SizeType1;
        "locale": Locale;
        "theme": ThemeConfig;
    }
    interface BeesExperiment {
    }
    interface BeesLayout {
        "beTagName"?: string;
        "hasSider"?: boolean;
        "prefixCls"?: string;
    }
    interface BeesLayoutContent {
        "beTagName"?: string;
        "hasSider"?: boolean;
        "prefixCls"?: string;
    }
    interface BeesLayoutFooter {
        "beTagName"?: string;
        "hasSider"?: boolean;
        "prefixCls"?: string;
    }
    interface BeesLayoutHeader {
        "beTagName"?: string;
        "hasSider"?: boolean;
        "prefixCls"?: string;
    }
    interface BeesLayoutSider {
        "breakpoint"?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
        "collapsed"?: boolean;
        "collapsedWidth"?: number | string;
        "collapsible"?: boolean;
        "defaultCollapsed"?: boolean;
        "onBeesBreakpoint"?: (event: BeesLayoutSiderCustomEvent<{ broken: boolean }>) => void;
        "onBeesCollapse"?: (event: BeesLayoutSiderCustomEvent<{ collapsed: boolean; type: 'clickTrigger' | 'responsive' }>) => void;
        "prefixCls"?: string;
        "reverseArrow"?: boolean;
        "theme"?: 'light' | 'dark';
        "trigger"?: any;
        "width"?: number | string;
        "zeroWidthTriggerStyle"?: CSSProperties;
    }
    interface BeesLocaleProvider {
        "locale"?: Locale1 | undefined;
    }
    interface BeesSpace {
    }
    interface BeesSpin {
        "delay"?: number;
        "indicator"?: any;
        "prefixCls"?: string;
        "size"?: SpinSize;
        "spinning"?: boolean;
        "tip"?: any;
        "wrapperClassName"?: string;
    }
    interface BeesWave {
        "disabled"?: boolean;
    }
    interface BeesWaveEffect {
        "myClassName"?: string | undefined;
        "target"?: HTMLElement | undefined;
    }
    interface IntrinsicElements {
        "bees-button": BeesButton;
        "bees-button-group": BeesButtonGroup;
        "bees-config-provider": BeesConfigProvider;
        "bees-experiment": BeesExperiment;
        "bees-layout": BeesLayout;
        "bees-layout-content": BeesLayoutContent;
        "bees-layout-footer": BeesLayoutFooter;
        "bees-layout-header": BeesLayoutHeader;
        "bees-layout-sider": BeesLayoutSider;
        "bees-locale-provider": BeesLocaleProvider;
        "bees-space": BeesSpace;
        "bees-spin": BeesSpin;
        "bees-wave": BeesWave;
        "bees-wave-effect": BeesWaveEffect;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "bees-button": LocalJSX.BeesButton & JSXBase.HTMLAttributes<HTMLBeesButtonElement>;
            "bees-button-group": LocalJSX.BeesButtonGroup & JSXBase.HTMLAttributes<HTMLBeesButtonGroupElement>;
            "bees-config-provider": LocalJSX.BeesConfigProvider & JSXBase.HTMLAttributes<HTMLBeesConfigProviderElement>;
            "bees-experiment": LocalJSX.BeesExperiment & JSXBase.HTMLAttributes<HTMLBeesExperimentElement>;
            "bees-layout": LocalJSX.BeesLayout & JSXBase.HTMLAttributes<HTMLBeesLayoutElement>;
            "bees-layout-content": LocalJSX.BeesLayoutContent & JSXBase.HTMLAttributes<HTMLBeesLayoutContentElement>;
            "bees-layout-footer": LocalJSX.BeesLayoutFooter & JSXBase.HTMLAttributes<HTMLBeesLayoutFooterElement>;
            "bees-layout-header": LocalJSX.BeesLayoutHeader & JSXBase.HTMLAttributes<HTMLBeesLayoutHeaderElement>;
            "bees-layout-sider": LocalJSX.BeesLayoutSider & JSXBase.HTMLAttributes<HTMLBeesLayoutSiderElement>;
            "bees-locale-provider": LocalJSX.BeesLocaleProvider & JSXBase.HTMLAttributes<HTMLBeesLocaleProviderElement>;
            "bees-space": LocalJSX.BeesSpace & JSXBase.HTMLAttributes<HTMLBeesSpaceElement>;
            "bees-spin": LocalJSX.BeesSpin & JSXBase.HTMLAttributes<HTMLBeesSpinElement>;
            "bees-wave": LocalJSX.BeesWave & JSXBase.HTMLAttributes<HTMLBeesWaveElement>;
            "bees-wave-effect": LocalJSX.BeesWaveEffect & JSXBase.HTMLAttributes<HTMLBeesWaveEffectElement>;
        }
    }
}
