import { GlobalToken, ComponentTokenMap } from '../interface';
import { UseComponentStyleResult, useToken, mergeToken, statisticToken } from '../internal';
import { CSSInterpolation, useStyleRegister } from '@baicie/cssinjs';
import { ConfigContext } from '@baicie/config-provider';
import { genCommonStyle, genLinkStyle } from '../../../style/src';
import { createMemo, useContext } from 'solid-js';

export type OverrideTokenWithoutDerivative = ComponentTokenMap;
export type OverrideComponent = keyof OverrideTokenWithoutDerivative;
export type GlobalTokenWithComponent<ComponentName extends OverrideComponent> = GlobalToken &
  ComponentTokenMap[ComponentName];

export interface StyleInfo<ComponentName extends OverrideComponent> {
  hashId: string;
  prefixCls: string;
  rootPrefixCls: string;
  iconPrefixCls: string;
  overrideComponentToken: ComponentTokenMap[ComponentName];
}

export type TokenWithCommonCls<T> = T & {
  /** Wrap component class with `.` prefix */
  componentCls: string;
  /** Origin prefix which do not have `.` prefix */
  prefixCls: string;
  /** Wrap icon class with `.` prefix */
  iconCls: string;
  /** Wrap ant prefixCls class with `.` prefix */
  antCls: string;
};
export type FullToken<ComponentName extends OverrideComponent> = TokenWithCommonCls<
  GlobalTokenWithComponent<ComponentName>
>;

export default function genComponentStyleHook<ComponentName extends OverrideComponent>(
  component: ComponentName,
  styleFn: (token: FullToken<ComponentName>, info: StyleInfo<ComponentName>) => CSSInterpolation,
  getDefaultToken?:
    | OverrideTokenWithoutDerivative[ComponentName]
    | ((token: GlobalToken) => OverrideTokenWithoutDerivative[ComponentName]),
) {
  return (_prefixCls?: string): UseComponentStyleResult => {
    const prefixCls = createMemo(() => _prefixCls);
    const [theme, token, hashId] = useToken();
    const { getPrefixCls, iconPrefixCls } = useContext(ConfigContext);
    const rootPrefixCls = createMemo(() => getPrefixCls());

    const sharedInfo = createMemo(() => {
      return {
        theme: theme(),
        token: token(),
        hashId: hashId(),
        path: ['Shared', rootPrefixCls()],
      };
    });
    // Generate style for all a tags in antd component.
    useStyleRegister(sharedInfo, () => [
      {
        // Link
        '&': genLinkStyle(token()),
      },
    ]);
    const componentInfo = createMemo(() => {
      return {
        theme: theme(),
        token: token(),
        hashId: hashId(),
        path: [component, prefixCls(), iconPrefixCls],
      };
    });

    return [
      useStyleRegister(componentInfo, () => {
        const { token: proxyToken, flush } = statisticToken(token());

        const defaultComponentToken =
          typeof getDefaultToken === 'function' ? (getDefaultToken as any)(proxyToken) : getDefaultToken;
        const mergedComponentToken = { ...defaultComponentToken, ...token()[component] };

        const componentCls = `.${prefixCls()}`;
        const mergedToken = mergeToken<TokenWithCommonCls<GlobalTokenWithComponent<OverrideComponent>>>(
          proxyToken,
          {
            componentCls,
            prefixCls: prefixCls(),
            iconCls: `.${iconPrefixCls}`,
            antCls: `.${rootPrefixCls()}`,
          },
          mergedComponentToken,
        );
        const styleInterpolation = styleFn(mergedToken as unknown as FullToken<ComponentName>, {
          hashId: hashId(),
          prefixCls: prefixCls(),
          rootPrefixCls: rootPrefixCls(),
          iconPrefixCls: iconPrefixCls,
          overrideComponentToken: token()[component],
        });
        flush(component, mergedComponentToken);
        return [genCommonStyle(token(), prefixCls()), styleInterpolation];
      }),
      hashId,
    ];
  };
}
