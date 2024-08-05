/**
 * Wrap of sub component which need use as Button capacity (like Icon component).
 *
 * This helps accessibility reader to tread as a interactive button to operation.
 */
import * as React from 'react';
import KeyCode from 'rc-util/lib/KeyCode';

interface TransButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  onClick?: (e?: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  noStyle?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
  tabIndex?: number;
}

const inlineStyle: React.CSSProperties = {
  border: 0,
  background: 'transparent',
  padding: 0,
  lineHeight: 'inherit',
  display: 'inline-flex',
};

const TransButton = React.forwardRef<HTMLDivElement, TransButtonProps>((props, ref) => {
  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    const { keyCode } = event;
    if (keyCode === KeyCode.ENTER) {
      event.preventDefault();
    }
  };

  const onKeyUp: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    const { keyCode } = event;
    const { onClick } = props;
    if (keyCode === KeyCode.ENTER && onClick) {
      onClick();
    }
  };

  const { style, noStyle, disabled, tabIndex = 0, ...restProps } = props;

  let mergedStyle: React.CSSProperties = {};

  if (!noStyle) {
    mergedStyle = {
      ...inlineStyle,
    };
  }

  if (disabled) {
    mergedStyle.pointerEvents = 'none';
  }

  mergedStyle = {
    ...mergedStyle,
    ...style,
  };

  return (
    <div
      role="button"
      tabIndex={tabIndex}
      ref={ref}
      {...restProps}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      style={mergedStyle}
    />
  );
});

export default TransButton;
