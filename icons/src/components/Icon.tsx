import classNames from 'clsx';
import Context from './Context';

import { svgBaseProps, warning, useInsertStyles } from '../utils';
import type { Ref } from 'solid-js';
import { type JSX, type Component, useContext } from 'solid-js';

export interface IconBaseProps extends JSX.HTMLAttributes<HTMLSpanElement> {
  spin?: boolean;
  rotate?: number;
  class?: string;
}

export interface CustomIconComponentProps {
  width: string | number;
  height: string | number;
  fill: string;
  viewBox?: string;
  class?: string;
  style?: JSX.CSSProperties;
  ref?: JSX.Element;
}
export interface IconComponentProps extends IconBaseProps {
  viewBox?: string;
  component?: Component<CustomIconComponentProps | JSX.SVGElementTags>;
  ariaLabel?: JSX.AriaAttributes['aria-label'];
}

const Icon: Component<IconComponentProps> = (props) => {
  const {
    // affect inner <svg>...</svg>
    component: Component,
    viewBox,
    spin,
    rotate,

    tabIndex,
    onClick,

    // children
    children,
    ...restProps
  } = props;

  let iconRef: Ref<HTMLElement> | undefined;

  warning(Boolean(Component || children), 'Should have `component` prop or `children`.');

  useInsertStyles(iconRef);

  const { prefixCls = 'anticon', rootClassName } = useContext(Context);

  const classString = classNames(rootClassName, prefixCls, props.class);

  const svgClassString = classNames({
    [`${prefixCls}-spin`]: !!spin,
  });

  const svgStyle = rotate
    ? {
        msTransform: `rotate(${rotate}deg)`,
        transform: `rotate(${rotate}deg)`,
      }
    : undefined;

  const innerSvgProps: CustomIconComponentProps = {
    ...svgBaseProps,
    class: svgClassString,
    style: svgStyle,
    viewBox,
  };

  if (!viewBox) {
    delete innerSvgProps.viewBox;
  }

  // component > children
  const renderInnerNode = () => {
    if (Component) {
      return <Component {...innerSvgProps}>{children}</Component>;
    }

    if (children) {
      warning(
        Boolean(viewBox),
        'Make sure that you provide correct `viewBox`' +
          ' prop (default `0 0 1024 1024`) to the icon.',
      );

      return (
        <svg {...innerSvgProps} viewBox={viewBox} ref={props.ref as any}>
          {children}
        </svg>
      );
    }

    return null;
  };

  let iconTabIndex = tabIndex;
  if (iconTabIndex === undefined && onClick) {
    iconTabIndex = -1;
  }

  return (
    <span
      role="img"
      {...restProps}
      ref={props.ref}
      tabIndex={iconTabIndex}
      onClick={onClick}
      class={classString}
    >
      {renderInnerNode()}
    </span>
  );
};

export default Icon;
