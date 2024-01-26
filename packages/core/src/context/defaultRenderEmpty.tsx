import type { Component, JSXElement } from 'solid-js';
// import { useContext } from 'solid-js';
// import type { ConfigConsumerProps } from '.';
// import { ConfigContext } from '.';
// import Empty from '../empty';

interface EmptyProps {
  componentName?: string;
}

const DefaultRenderEmpty: Component<EmptyProps> = () => {
  // const { componentName } = props;
  // const { getPrefixCls } = useContext<ConfigConsumerProps>(ConfigContext);
  // const prefix = getPrefixCls('empty');
  // switch (componentName) {
  //   case 'Table':
  //   case 'List':
  //   // return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  //   // eslint-disable-next-line no-fallthrough
  //   case 'Select':
  //   case 'TreeSelect':
  //   case 'Cascader':
  //   case 'Transfer':
  //   case 'Mentions':
  //   // return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} class={`${prefix}-small`} />;
  //   /* istanbul ignore next */
  //   default:
  //   // Should never hit if we take all the component into consider.
  //   // return <Empty />;
  // }
  return null;
};

export type RenderEmptyHandler = (componentName?: string) => JSXElement;

export default DefaultRenderEmpty;
