import { generate } from '@ant-design/colors';
import uniq from 'lodash/uniq';
import React from 'preact/compat';

import ColorBlock from './ColorBlock';

interface ColorPatternsProps {
  color?: string;
  dark?: boolean;
  backgroundColor?: string;
}

const ColorPatterns: React.FC<ColorPatternsProps> = ({ color, dark, backgroundColor }) => {
  const colors = generate(color, dark ? { theme: 'dark', backgroundColor } : {});
  return (
    <>
      {uniq(colors).map((colorString, i) => (
        <ColorBlock color={colorString} index={i + 1} dark={dark} key={colorString} />
      ))}
    </>
  );
};

export default ColorPatterns;
