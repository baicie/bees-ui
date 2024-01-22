
import classNames from 'classnames';
import { JSX, JSXElement } from 'solid-js';

export type IconWrapperProps = {
  prefixCls: string;
  className?: string;
  style?: JSX.CSSProperties;
  children?: JSXElement;
  ref?: JSX.CustomAttributes<HTMLSpanElement>['ref'];
};

const IconWrapper = (props: IconWrapperProps) => {
  const { className, style, children, prefixCls } = props;

  const iconWrapperCls = classNames(`${prefixCls}-icon`, className);

  return (
    <span ref={props.ref} class={iconWrapperCls} style={style}>
      {children}
    </span>
  );
};

export default IconWrapper;
