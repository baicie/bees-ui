// GENERATE BY ./scripts/generate.ts
// DON NOT EDIT IT MANUALLY

import * as React from 'preact/compat';
import FilterFilledSvg from '@ant-design/icons-svg/lib/asn/FilterFilled';
import AntdIcon, { AntdIconProps } from '../components/AntdIcon';

const FilterFilled = (
  props: AntdIconProps,
  ref: React.MutableRefObject<HTMLSpanElement>,
) => <AntdIcon {...props} ref={ref} icon={FilterFilledSvg} />;

 /**![filter](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIGZpbGw9IiNjYWNhY2EiIHZpZXdCb3g9IjY0IDY0IDg5NiA4OTYiIGZvY3VzYWJsZT0iZmFsc2UiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTM0OSA4MzhjMCAxNy43IDE0LjIgMzIgMzEuOCAzMmgyNjIuNGMxNy42IDAgMzEuOC0xNC4zIDMxLjgtMzJWNjQySDM0OXYxOTZ6bTUzMS4xLTY4NEgxNDMuOWMtMjQuNSAwLTM5LjggMjYuNy0yNy41IDQ4bDIyMS4zIDM3NmgzNDguOGwyMjEuMy0zNzZjMTIuMS0yMS4zLTMuMi00OC0yNy43LTQ4eiIgLz48L3N2Zz4=) */ 
const RefIcon: React.ForwardRefExoticComponent<
  Omit<AntdIconProps, 'ref'> & React.RefAttributes<HTMLSpanElement>
> = React.forwardRef<HTMLSpanElement, AntdIconProps>(FilterFilled);

if (process.env.NODE_ENV !== 'production') {
  RefIcon.displayName = 'FilterFilled';
}

export default RefIcon;