import ColorPicker, { Color } from '@rc-component/color-picker';
import React, { useState } from 'react';
import '../../assets/index.less';

let start = true;

export default () => {
  const [value, setValue] = useState(new Color('rgba(255,0,0,0)'));

  return (
    <>
      <ColorPicker
        value={value}
        onChange={nextValue => {
          let proxyValue = nextValue;

          if (start) {
            start = false;
            proxyValue = nextValue.setA(1);
          }

          setValue(proxyValue);
        }}
      />
      <br />
      <div
        style={{
          width: 258,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        <span>hex: {value.toHexString()}</span>
        <span> rgb: {value.toRgbString()}</span>
        <span> hsb: {value.toHsbString()}</span>
      </div>
    </>
  );
};
