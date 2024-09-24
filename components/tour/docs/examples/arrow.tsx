import React, { useRef } from 'react';
import Tour from '../../src/index';
import './basic.less';

const App = () => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [arrow, setArrow] = React.useState<
    boolean | { pointAtCenter: boolean }
  >(true);
  return (
    <div style={{ margin: '200px 0 400px', textAlign: 'center' }}>
      <div style={{ height: 200 }} />
      <button
        ref={btnRef}
        onClick={() => {
          setArrow(arrow === true ? { pointAtCenter: true } : true);
        }}
        style={{ width: 200 }}
      >
        arrow: {JSON.stringify(arrow)}
      </button>
      <Tour
        defaultCurrent={0}
        arrow={arrow}
        placement={'topRight'}
        steps={[
          {
            title: '创建',
            description: '创建一条数据',
            target: () => btnRef.current,
          },
        ]}
      />
    </div>
  );
};

export default App;
