/// <reference types="vite/client" />
interface MyWebComponentProps {
  propA: string;
  propB?: number;
}

declare namespace JSX {
  interface IntrinsicElements {
    'my-web-component': MyWebComponentProps;
  }
}
