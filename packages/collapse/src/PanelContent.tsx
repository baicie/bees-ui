import classnames from 'classnames';
import React from 'react';
import type { CollapsePanelProps } from './interface';

const PanelContent = React.forwardRef<
  HTMLDivElement,
  CollapsePanelProps & { children: React.ReactNode }
>((props, ref) => {
  const {
    prefixCls,
    forceRender,
    className,
    style,
    children,
    isActive,
    role,
    classNames: customizeClassNames,
    styles,
  } = props;

  const [rendered, setRendered] = React.useState(isActive || forceRender);

  React.useEffect(() => {
    if (forceRender || isActive) {
      setRendered(true);
    }
  }, [forceRender, isActive]);

  if (!rendered) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={classnames(
        `${prefixCls}-content`,
        {
          [`${prefixCls}-content-active`]: isActive,
          [`${prefixCls}-content-inactive`]: !isActive,
        },
        className,
      )}
      style={style}
      role={role}
    >
      <div
        className={classnames(`${prefixCls}-content-box`, customizeClassNames?.body)}
        style={styles?.body}
      >
        {children}
      </div>
    </div>
  );
});

PanelContent.displayName = 'PanelContent';

export default PanelContent;
