import type { Component, Ref } from 'solid-js';
import type { JSXElement } from 'solid-js';
export interface DomWrapperProps {
  children?: JSXElement;
  ref: Ref<JSXElement>;
}

/**
 * Fallback to findDOMNode if origin ref do not provide any dom element
 */
const DomWrapper: Component<DomWrapperProps> = (props: DomWrapperProps) => props.children;

export default DomWrapper;
