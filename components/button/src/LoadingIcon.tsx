// import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import type { CSSProperties } from '@bees-ui/core';
import { clsx } from '@bees-ui/core';
import type { Component } from 'solid-js';

// import CSSMotion from 'rc-motion';
import IconWrapper from './IconWrapper';

type InnerLoadingIconProps = {
  prefixCls: string;
  className?: string;
  style?: CSSProperties;
  iconClassName?: string;
  ref?: any;
};

const InnerLoadingIcon: Component<InnerLoadingIconProps> = (props) => {
  const { prefixCls, className, style, iconClassName, ref } = props;
  const mergedIconCls = clsx(`${prefixCls}-loading-icon`, className);

  return (
    <IconWrapper prefixCls={prefixCls} className={mergedIconCls} style={style} ref={ref}>
      <div class={iconClassName} />
    </IconWrapper>
  );
};

export interface LoadingIconProps {
  prefixCls: string;
  existIcon: boolean;
  loading?: boolean | object;
  className?: string;
  style?: CSSProperties;
}

// const getCollapsedWidth = (): CSSProperties => ({
//   width: 0,
//   opacity: 0,
//   transform: 'scale(0)',
// });

// const getRealWidth = (node: HTMLElement): CSSProperties => ({
//   width: node.scrollWidth,
//   opacity: 1,
//   transform: 'scale(1)',
// });

const LoadingIcon: Component<LoadingIconProps> = (props) => {
  const { prefixCls, existIcon, className, style } = props;
  // const visible = !!loading;

  if (existIcon) {
    return <InnerLoadingIcon prefixCls={prefixCls} className={className} style={style} />;
  }

  return (
    <div>void</div>
    // <CSSMotion
    //   visible={visible}
    //   // We do not really use this motionName
    //   motionName={`${prefixCls}-loading-icon-motion`}
    //   motionLeave={visible}
    //   removeOnLeave
    //   onAppearStart={getCollapsedWidth}
    //   onAppearActive={getRealWidth}
    //   onEnterStart={getCollapsedWidth}
    //   onEnterActive={getRealWidth}
    //   onLeaveStart={getRealWidth}
    //   onLeaveActive={getCollapsedWidth}
    // >
    //   {({ className: motionCls, style: motionStyle }, ref: React.Ref<HTMLSpanElement>) => (
    //     <InnerLoadingIcon
    //       prefixCls={prefixCls}
    //       className={className}
    //       style={{ ...style, ...motionStyle }}
    //       ref={ref}
    //       iconClassName={motionCls}
    //     />
    //   )}
    // </CSSMotion>
  );
};

export default LoadingIcon;
