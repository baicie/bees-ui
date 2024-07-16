// classnames的平替 包体积更小
import { blue } from '@ant-design/colors';
import type { IconDefinition } from '@ant-design/icons-svg/lib/types';
import { clsx as classNames } from 'clsx';
import { useContext, type Component } from 'solid-js';

import { normalizeTwoToneColors } from '../utils';
// 全局上下文
import Context from './Context';
// 基础的props 是否旋转spin 类名class
import type { IconBaseProps } from './Icon';
// 基础的icon
import SolidIcon from './IconBase';
import { getTwoToneColor, setTwoToneColor } from './twoTonePrimaryColor';
import type { TwoToneColor } from './twoTonePrimaryColor';

export interface AntdIconProps extends IconBaseProps {
  twoToneColor?: TwoToneColor;
  ref?: any;
}

export interface IconComponentProps extends AntdIconProps {
  icon: IconDefinition;
}

// 为渲染函数增加额外的三个属性
interface IconBaseComponent<P> extends Component<P> {
  displayName: string;
  getTwoToneColor: typeof getTwoToneColor;
  setTwoToneColor: typeof setTwoToneColor;
}

// Initial setting
// should move it to antd main repo?
setTwoToneColor(blue.primary!);

const Icon: IconBaseComponent<IconComponentProps> = (props) => {
  // 结构在solidjs中会破坏响应式 这么些又问题之后找到好的办法再说
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
  // 从上下文获取一些属性
  const { prefixCls = 'anticon', rootClassName } = useContext(Context);
  // 生产类名
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
