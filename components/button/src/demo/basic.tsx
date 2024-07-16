import React from 'react';
import { Flex } from 'antd';

import '../registe';

const App: React.FC = () => (
  <Flex gap="small" wrap="wrap">
    <bees-button type="primary">Primary Button</bees-button>
    <bees-button>Default Button</bees-button>
    <bees-button type="dashed">Dashed Button</bees-button>
    <bees-button type="text">Text Button</bees-button>
    <bees-button type="link">Link Button</bees-button>
  </Flex>
);

export default App;
