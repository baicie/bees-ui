import type { JSX } from 'solid-js';
import { createEffect } from 'solid-js';

import { devUseWarning } from '../_util/warning';

export interface PropWarningProps {
  dropdownMatchSelectWidth?: boolean;
}

/**
 * Warning for ConfigProviderProps.
 * This will be an empty function in production.
 */
const PropWarning = (props: PropWarningProps): JSX.Element => {
  const { dropdownMatchSelectWidth } = props;
  const warning = devUseWarning('ConfigProvider');

  createEffect(() => {
    warning.deprecated(
      dropdownMatchSelectWidth === undefined,
      'dropdownMatchSelectWidth',
      'popupMatchSelectWidth',
    );
  });

  return null;
};

export default process.env.NODE_ENV !== 'production' ? PropWarning : (): JSX.Element | null => null;
