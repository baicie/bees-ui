import type { JSX } from 'solid-js';

type ComponentName =
  | 'Table'
  | 'Table.filter'
  | 'List'
  | 'Select'
  | 'TreeSelect'
  | 'Cascader'
  | 'Transfer'
  | 'Mentions';

interface EmptyProps {
  componentName?: ComponentName;
}

const DefaultRenderEmpty = (props: EmptyProps): JSX.Element => {
  const { componentName } = props;
  // const { getPrefixCls } = useContext(ConfigContext);
  // const prefix = getPrefixCls('empty');

  switch (componentName) {
    case 'Table':
    case 'List':
    case 'Select':
    case 'TreeSelect':
    case 'Cascader':
    case 'Transfer':
    case 'Mentions':
    case 'Table.filter':
      // Return `null` similar to React for this case.
      return null;
    default:
      return null;
  }
};

export type RenderEmptyHandler = (componentName?: ComponentName) => JSX.Element | null;

export default DefaultRenderEmpty;
