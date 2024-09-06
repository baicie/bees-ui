import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { BeesButton } from '../registe';

export default function mountTest(tagName: string) {
  describe(`mount and unmount for <${tagName}>`, () => {
    it(`web component could be updated and unmounted without errors`, () => {
      // 创建组件实例
      const component = document.createElement(tagName);
      document.body.appendChild(component);

      // 测试更新：可以通过重新设置属性或者插槽内容进行更新模拟
      // expect(() => {
      //   component.setAttribute('data-test', 'updated');
      //   component.innerHTML = '<span>Updated content</span>';
      // }).not.toThrow();

      // 卸载组件
      expect(() => {
        component.remove();
      }).not.toThrow();
    });
  });
}

describe('BeesButton Web Component', () => {
  beforeAll(() => {
    BeesButton(); // 注册 web component
  });

  // mountTest('bees-button');

  beforeEach(() => {
    // 清空文档的 body 以确保测试隔离
    document.body.innerHTML = '<bees-button></bees-button>';
  });

  it('should render the button', () => {
    const button = document.querySelector('bees-button');
    expect(button).toBeTruthy();
  });
});
