// GENERATE BY ./scripts/generate.ts
// DON NOT EDIT IT MANUALLY

import EnvironmentFilledSvg from '@ant-design/icons-svg/lib/asn/EnvironmentFilled';

import AntdIcon, { type AntdIconProps } from '../components/AntdIcon';

const EnvironmentFilled = (props: AntdIconProps) => (
  <AntdIcon {...props} ref={props.ref} icon={EnvironmentFilledSvg} />
);

if (process.env.NODE_ENV !== 'production') {
  EnvironmentFilled.displayName = 'EnvironmentFilled';
}
export default EnvironmentFilled;
