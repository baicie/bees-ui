// GENERATE BY ./scripts/generate.ts
// DON NOT EDIT IT MANUALLY

import * as React from 'preact/compat';
import BorderOutlinedSvg from '@ant-design/icons-svg/lib/asn/BorderOutlined';
import AntdIcon, { AntdIconProps } from '../components/AntdIcon';

const BorderOutlined = (
  props: AntdIconProps,
  ref: React.MutableRefObject<HTMLSpanElement>,
) => <AntdIcon {...props} ref={ref} icon={BorderOutlinedSvg} />;

 /**![border](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIGZpbGw9IiNjYWNhY2EiIHZpZXdCb3g9IjY0IDY0IDg5NiA4OTYiIGZvY3VzYWJsZT0iZmFsc2UiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTg4MCAxMTJIMTQ0Yy0xNy43IDAtMzIgMTQuMy0zMiAzMnY3MzZjMCAxNy43IDE0LjMgMzIgMzIgMzJoNzM2YzE3LjcgMCAzMi0xNC4zIDMyLTMyVjE0NGMwLTE3LjctMTQuMy0zMi0zMi0zMnptLTQwIDcyOEgxODRWMTg0aDY1NnY2NTZ6IiAvPjwvc3ZnPg==) */ 
const RefIcon: React.ForwardRefExoticComponent<
  Omit<AntdIconProps, 'ref'> & React.RefAttributes<HTMLSpanElement>
> = React.forwardRef<HTMLSpanElement, AntdIconProps>(BorderOutlined);

if (process.env.NODE_ENV !== 'production') {
  RefIcon.displayName = 'BorderOutlined';
}

export default RefIcon;