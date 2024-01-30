import { clsx as classNames } from 'clsx';
import type { IconDefinition } from '@ant-design/icons-svg/lib/types';
import { blue } from '@ant-design/colors';

import Context from './Context';
import type { IconBaseProps } from './Icon';
import SolidIcon from './IconBase';
import { getTwoToneColor, setTwoToneColor } from './twoTonePrimaryColor';
import type { TwoToneColor } from './twoTonePrimaryColor';
import { normalizeTwoToneColors } from '../utils';
import { useContext, type Component } from 'solid-js';

export interface AntdIconProps extends IconBaseProps {
  twoToneColor?: TwoToneColor;
  ref?: any;
}

export interface IconComponentProps extends AntdIconProps {
  icon: IconDefinition;
}

interface IconBaseComponent<P> extends Component<P> {
  displayName: string;
  getTwoToneColor: typeof getTwoToneColor;
  setTwoToneColor: typeof setTwoToneColor;
}

// Initial setting
// should move it to antd main repo?
setTwoToneColor(blue.primary!);

const Icon: IconBaseComponent<IconComponentProps> = (props) => {
  const {
    // affect outter <i>...</i>
    // affect inner <svg>...</svg>
    icon,
    spin,
    rotate,

    tabIndex,
    onClick,

    // other
    twoToneColor,

    ...restProps
  } = props;

  const { prefixCls = 'anticon', rootClassName } = useContext(Context);

  const classString = classNames(
    rootClassName,
    prefixCls,
    {
      [`${prefixCls}-${icon.name}`]: !!icon.name,
      [`${prefixCls}-spin`]: !!spin || icon.name === 'loading',
    },
    props.class,
  );

  let iconTabIndex = tabIndex;
  if (iconTabIndex === undefined && onClick) {
    iconTabIndex = -1;
  }

  const svgStyle = rotate
    ? {
        msTransform: `rotate(${rotate}deg)`,
        transform: `rotate(${rotate}deg)`,
      }
    : undefined;

  const [primaryColor, secondaryColor] = normalizeTwoToneColors(twoToneColor);

  return (
    <span
      role="img"
      aria-label={icon.name}
      {...restProps}
      ref={props.ref}
      tabIndex={iconTabIndex}
      onClick={onClick}
      class={classString}
    >
      <SolidIcon
        icon={icon}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        style={svgStyle}
      />
    </span>
  );
};

Icon.displayName = 'AntdIcon';
Icon.getTwoToneColor = getTwoToneColor;
Icon.setTwoToneColor = setTwoToneColor;

export default Icon;
