import { Component, JSX } from 'solid-js';

interface DomWrapperProps {
  children: JSX.Element;
}

const DomWrapper: Component<DomWrapperProps> = (props) => {
  console.log('DomWrapper', props);

  return props.children;
};

export default DomWrapper;
