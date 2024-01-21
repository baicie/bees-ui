import { ObservableMap, createStore } from '@stencil/store';
import CacheEntity from './cache';
import { Linter } from './linters';
import type { Transformer } from './transformers/interface';

export const ATTR_TOKEN = 'data-token-hash';
export const ATTR_MARK = 'data-css-hash';
export const ATTR_CACHE_PATH = 'data-cache-path';

export const CSS_IN_JS_INSTANCE = '__cssinjs_instance__';

export function createCache() {
  const cssinjsInstanceId = Math.random().toString(12).slice(2);

  // Tricky SSR: Move all inline style to the head.
  // PS: We do not recommend tricky mode.
  if (typeof document !== 'undefined' && document.head && document.body) {
    const styles: Iterable<any> | ArrayLike<any> = document.body.querySelectorAll(`style[${ATTR_MARK}]`) || [];
    const { firstChild } = document.head;

    Array.from(styles).forEach((style) => {
      (style as any)[CSS_IN_JS_INSTANCE] = (style as any)[CSS_IN_JS_INSTANCE] || cssinjsInstanceId;

      // Not force move if no head
      if ((style as any)[CSS_IN_JS_INSTANCE] === cssinjsInstanceId) {
        document.head.insertBefore(style, firstChild);
      }
    });

    // Deduplicate of moved styles
    const styleHash: Record<string, boolean> = {};
    Array.from(document.querySelectorAll(`style[${ATTR_MARK}]`)).forEach((style) => {
      const hash = style.getAttribute(ATTR_MARK)!;
      if (styleHash[hash]) {
        if ((style as any)[CSS_IN_JS_INSTANCE] === cssinjsInstanceId) {
          style.parentNode?.removeChild(style);
        }
      } else {
        styleHash[hash] = true;
      }
    });
  }

  return new CacheEntity(cssinjsInstanceId);
}

export type HashPriority = 'low' | 'high';

export interface StyleContextProps {
  autoClear?: boolean;
  /** @private Test only. Not work in production. */
  mock?: 'server' | 'client';
  /**
   * Only set when you need ssr to extract style on you own.
   * If not provided, it will auto create <style /> on the end of Provider in server side.
   */
  cache: CacheEntity;
  /** Tell children that this context is default generated context */
  defaultCache: boolean;
  /** Use `:where` selector to reduce hashId css selector priority */
  hashPriority?: HashPriority;
  /** Tell cssinjs where to inject style in */
  container?: Element | ShadowRoot;
  /** Component wil render inline  `<style />` for fallback in SSR. Not recommend. */
  ssrInline?: boolean;
  /** Transform css before inject in document. Please note that `transformers` do not support dynamic update */
  transformers?: Transformer[];
  /**
   * Linters to lint css before inject in document.
   * Styles will be linted after transforming.
   * Please note that `linters` do not support dynamic update.
   */
  linters?: Linter[];
}

const StyleContext = createStore<StyleContextProps>({
  hashPriority: 'low',
  cache: createCache(),
  defaultCache: true,
});

export function useStyleContext(context: ObservableMap<StyleContextProps>) {
  return context.state;
}

export default StyleContext;
