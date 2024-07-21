import { Alert, theme } from 'antd';
import { LiveContext } from 'dumi';
import type { FC } from 'preact/compat';
import React, { useContext } from 'preact/compat';

const LiveError: FC = () => {
  const { error } = useContext(LiveContext);
  const { token } = theme.useToken();

  return error ? (
    <Alert banner type="error" message={error} style={{ color: token.colorError }} />
  ) : null;
};

export default LiveError;
