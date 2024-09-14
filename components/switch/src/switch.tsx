import type { SwitchChangeEventHandler, SwitchProps } from '@bees-ui/core';
import { ConfigContext, DisabledContext, useSize, Wave } from '@bees-ui/core';
import { LoadingOutlined } from '@bees-ui/sc-icons';
import RcSwitch from '@bees-ui/sc-switch';
import classNames from 'clsx';
import { splitProps, useContext } from 'solid-js';
import { createStore } from 'solid-js/store';

import useStyle from './style';

const InternalSwitch = (props: SwitchProps) => {
  const [local, restProps] = splitProps(props, [
    'prefixCls',
    'size',
    'disabled',
    'loading',
    'className',
    'rootClassName',
    'style',
    'checked',
    'value',
    'defaultChecked',
    'defaultValue',
    'onChange',
  ]);

  const [checked, setChecked] = createStore({
    value: local.checked ?? local.value ?? false,
    defaultValue: local.defaultChecked ?? local.defaultValue ?? false,
  });

  const { getPrefixCls, direction, switch: SWITCH } = useContext(ConfigContext);
  const disabled = useContext(DisabledContext);

  const mergedDisabled = (local.disabled ?? disabled) || local.loading;
  const prefixCls = getPrefixCls('switch', local.prefixCls);

  const loadingIcon = (
    <div class={`${prefixCls}-handle`}>
      {local.loading && <LoadingOutlined class={`${prefixCls}-loading-icon`} />}
    </div>
  );

  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);
  const mergedSize = useSize(local.size);

  const classes = classNames(
    SWITCH?.className,
    {
      [`${prefixCls}-small`]: mergedSize() === 'small',
      [`${prefixCls}-loading`]: local.loading,
      [`${prefixCls}-rtl`]: direction === 'rtl',
    },
    local.className,
    local.rootClassName,
    hashId,
    cssVarCls,
  );

  const mergedStyle = { ...SWITCH?.style, ...local.style };

  const changeHandler: SwitchChangeEventHandler = (checked, event) => {
    setChecked('value', checked);
    local.onChange?.(checked, event);
  };

  return wrapCSSVar(
    <Wave component="Switch">
      <RcSwitch
        {...restProps}
        checked={checked.value}
        onChange={changeHandler}
        prefixCls={prefixCls}
        className={classes}
        style={mergedStyle}
        disabled={mergedDisabled}
        loadingIcon={loadingIcon}
      />
    </Wave>,
  );
};

export default InternalSwitch;
