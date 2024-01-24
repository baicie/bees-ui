import React, { useEffect, useState } from 'react';
import { ColorPicker, Input, Space } from 'antd';
import { createStyles } from 'antd-style';
import type { Color } from 'antd/es/color-picker';
import { generateColor } from 'antd/es/color-picker/util';
import classNames from 'classnames';

import { PRESET_COLORS } from './colorUtil';

const useStyle = createStyles(({ token, css }) => ({
  color: css`
    width: ${token.controlHeightLG / 2}px;
    height: ${token.controlHeightLG / 2}px;
    border-radius: 100%;
    cursor: pointer;
    transition: all ${token.motionDurationFast};
    display: inline-block;

    & > input[type='radio'] {
      width: 0;
      height: 0;
      opacity: 0;
    }

    &:focus-within {
      // need ？
    }
  `,

  colorActive: css`
    box-shadow:
      0 0 0 1px ${token.colorBgContainer},
      0 0 0 ${token.controlOutlineWidth * 2 + 1}px ${token.colorPrimary};
  `,
}));

export interface ColorPickerProps {
  id?: string;
  children?: React.ReactNode;
  value?: string | Color;
  onChange?: (value?: Color | string) => void;
}

const DebouncedColorPicker: React.FC<ColorPickerProps> = (props) => {
  const { value: color, children, onChange } = props;
  const [value, setValue] = useState(color);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange?.(value);
    }, 200);
    return () => clearTimeout(timeout);
  }, [value]);

  useEffect(() => {
    setValue(color);
  }, [color]);

  return (
    <ColorPicker
      value={value}
      onChange={setValue}
      presets={[{ label: 'PresetColors', colors: PRESET_COLORS }]}
    >
      {children}
    </ColorPicker>
  );
};

const ThemeColorPicker: React.FC<ColorPickerProps> = ({ value, onChange, id }) => {
  const { styles } = useStyle();

  const matchColors = React.useMemo(() => {
    const valueStr = generateColor(value || '').toRgbString();
    let existActive = false;
    const colors = PRESET_COLORS.map((color) => {
      const colorStr = generateColor(color).toRgbString();
      const active = colorStr === valueStr;
      existActive = existActive || active;
      return { color, active, picker: false };
    });

    return [
      ...colors,
      {
        color: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)',
        picker: true,
        active: !existActive,
      },
    ];
  }, [value]);

  return (
    <Space size="large">
      <Input
        value={typeof value === 'string' ? value : value?.toHexString()}
        onChange={(event) => onChange?.(event.target.value)}
        style={{ width: 120 }}
        id={id}
      />

      <Space size="middle">
        {matchColors.map(({ color, active, picker }) => {
          let colorNode = (
            // eslint-disable-next-line jsx-a11y/label-has-associated-control
            <label
              key={color}
              className={classNames(styles.color, active && styles.colorActive)}
              style={{ background: color }}
              onClick={() => {
                if (!picker) {
                  onChange?.(color);
                }
              }}
            >
              <input
                type="radio"
                name={picker ? 'picker' : 'color'}
                tabIndex={picker ? -1 : 0}
                onClick={(e) => e.stopPropagation()}
              />
            </label>
          );

          if (picker) {
            colorNode = (
              <DebouncedColorPicker
                key={`colorpicker-${value}`}
                value={value || ''}
                onChange={onChange}
              >
                {colorNode}
              </DebouncedColorPicker>
            );
          }

          return colorNode;
        })}
      </Space>
    </Space>
  );
};

export default ThemeColorPicker;
