import type { AlertProps } from 'antd';
import { Alert } from 'antd';
import React from 'preact/compat';

const MdAlert: React.FC<AlertProps> = ({ style, ...props }) => (
  <Alert {...props} style={{ margin: '24px 0', ...style }} />
);

export default MdAlert;
