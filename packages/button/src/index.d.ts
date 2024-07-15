export interface MyElement extends HTMLElement {
  greet(): void;
  name: string;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "hello-world": React.DetailedHTMLProps<
        React.HTMLAttributes<MyElement> & { name?: string },
        MyElement
      >;
    }
  }

  interface HTMLElementTagNameMap {
    "hello-world": MyElement;
  }
}
