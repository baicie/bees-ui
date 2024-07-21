import { Skeleton } from 'antd';
import { createStyles } from 'antd-style';
import type { FC } from 'preact/compat';
import React, { Suspense } from 'preact/compat';

import type { BehaviorMapProps } from './BehaviorMap';

const InternalBehaviorMap = React.lazy(() => import('./BehaviorMap'));

const useStyle = createStyles(({ token, css }) => ({
  fallback: css`
    width: 100%;
    > * {
      width: 100%;
      border-radius: 8px;
    }
  `,
  placeholder: css`
    color: ${token.colorTextDescription};
    font-size: 16px;
  `,
}));

const BehaviorMapFallback = () => {
  const { styles } = useStyle();

  return (
    <div className={styles.fallback}>
      <Skeleton.Node active style={{ height: 600, width: '100%' }}>
        <span className={styles.placeholder}>正在载入行为模式地图...</span>
      </Skeleton.Node>
    </div>
  );
};

const BehaviorMap: FC<BehaviorMapProps> = (props) => (
  <Suspense fallback={<BehaviorMapFallback />}>
    <InternalBehaviorMap {...props} />
  </Suspense>
);

export default BehaviorMap;
