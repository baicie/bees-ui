// GENERATE BY ./scripts/generate.ts
// DON NOT EDIT IT MANUALLY

import * as React from 'preact/compat';
import CaretDownOutlinedSvg from '@ant-design/icons-svg/lib/asn/CaretDownOutlined';
import AntdIcon, { AntdIconProps } from '../components/AntdIcon';

const CaretDownOutlined = (
  props: AntdIconProps,
  ref: React.MutableRefObject<HTMLSpanElement>,
) => <AntdIcon {...props} ref={ref} icon={CaretDownOutlinedSvg} />;

 /**![caret-down](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIGZpbGw9IiNjYWNhY2EiIHZpZXdCb3g9IjAgMCAxMDI0IDEwMjQiIGZvY3VzYWJsZT0iZmFsc2UiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTg0MC40IDMwMEgxODMuNmMtMTkuNyAwLTMwLjcgMjAuOC0xOC41IDM1bDMyOC40IDM4MC44YzkuNCAxMC45IDI3LjUgMTAuOSAzNyAwTDg1OC45IDMzNWMxMi4yLTE0LjIgMS4yLTM1LTE4LjUtMzV6IiAvPjwvc3ZnPg==) */ 
const RefIcon: React.ForwardRefExoticComponent<
  Omit<AntdIconProps, 'ref'> & React.RefAttributes<HTMLSpanElement>
> = React.forwardRef<HTMLSpanElement, AntdIconProps>(CaretDownOutlined);

if (process.env.NODE_ENV !== 'production') {
  RefIcon.displayName = 'CaretDownOutlined';
}

export default RefIcon;