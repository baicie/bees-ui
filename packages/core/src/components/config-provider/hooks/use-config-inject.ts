import { inject } from '@utils/store';
import { configProviderKey, defaultConfigProvider } from '../context';
import { useInjectDisabled } from '../disabled-context';
import { useInjectSize } from '../size-context';

export default (name: string, props: Record<string, any>) => {
  const sizeContext = useInjectSize();
  const disabledContext = useInjectDisabled();
  const configProvider = inject(configProviderKey, {
    ...defaultConfigProvider,
    // renderEmpty: (name?: string) => h(DefaultRenderEmpty, { componentName: name }),
  });
  const prefixCls = configProvider.getPrefixCls(name, props.prefixCls);
  const direction = props.direction ?? configProvider.direction;
  const iconPrefixCls = props.iconPrefixCls ?? configProvider.iconPrefixCls;
  const rootPrefixCls = configProvider.getPrefixCls();

  const size = props.size ?? sizeContext.value;
  const disabled = props.disabled ?? disabledContext.value;

  return {
    prefixCls,
    direction,
    iconPrefixCls,
    rootPrefixCls,

    size,
    disabled,
  };
};
