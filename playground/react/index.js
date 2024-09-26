class MyElement extends HTMLElement {
  constructor() {
    super()
    this.innerHTML = `
      <style>
        /* 样式定义 */
      </style>
      <div>
        <slot name="header"></slot>
        <slot></slot> <!-- 默认插槽 -->
        <slot name="footer"></slot>
      </div>
    `
  }
}

customElements.define('my-element', MyElement)
