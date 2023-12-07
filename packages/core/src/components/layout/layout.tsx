import { useConfigInject } from '@components/config-provider';
import { Component, ComponentInterface, Prop, h } from '@stencil/core';
import useStyle from './style';
import { provide } from '@utils/store';
import { computed, ref } from '@vue/reactivity';
import { SiderHookProviderKey } from './injectionKey';
import classNames from 'classnames';

@Component({
  tag: 'bees-layout',
})
export class Layout implements ComponentInterface {
  @Prop({ reflect: true }) prefixCls: string;

  @Prop({ reflect: true }) hasSider: boolean = false;

  @Prop({ reflect: true }) beTagName: string;

  render() {
    const { prefixCls, direction } = useConfigInject('', this);
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const siders = ref<string[]>([]);
    const siderHookProvider = {
      addSider: (id: string) => {
        siders.value = [...siders.value, id];
      },
      removeSider: (id: string) => {
        siders.value = siders.value.filter((currentId) => currentId !== id);
      },
    };

    provide(SiderHookProviderKey, siderHookProvider);
    const divCls = computed(() => {
      const { prefixCls, hasSider } = this;
      return {
        [hashId.value]: true,
        [`${prefixCls}`]: true,
        [`${prefixCls}-has-sider`]: typeof hasSider === 'boolean' ? hasSider : siders.value.length > 0,
        [`${prefixCls}-rtl`]: direction.value === 'rtl',
      };
    });

    const classs = computed(() => classNames(divCls.value));

    let layoutNode = (
      <beTagName class={classs.value}>
        <slot></slot>
      </beTagName>
    );

    return wrapSSR(layoutNode);
  }
}
