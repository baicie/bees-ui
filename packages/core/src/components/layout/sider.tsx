import { useConfigInject } from '@components/config-provider';
import { Component, ComponentInterface, Prop, State, h, Event, Watch, EventEmitter } from '@stencil/core';
import { inject, provide } from '@utils/store';
import { Properties as CSSProperties } from 'csstype';
import { SiderCollapsedKey, SiderHookProviderKey } from './injectionKey';
import { shallowRef } from '@vue/reactivity';
import classNames from 'classnames';
import { chevronDown } from 'ionicons/icons';
import isNumeric from '@utils/isNumeric';
import { StencilCSS } from '@utils/type';

export type CollapseType = 'clickTrigger' | 'responsive';

@Component({
  tag: 'bees-layout-sider',
})
export class Sider implements ComponentInterface {
  @Prop({ reflect: true }) prefixCls: string;

  @Prop({ reflect: true }) collapsible: boolean = false;

  @Prop({ reflect: true }) collapsed: boolean = undefined;

  @Prop({ reflect: true }) defaultCollapsed: boolean = false;

  @Prop({ reflect: true }) reverseArrow: boolean = false;

  @Prop({ reflect: true }) width: number | string = 200;

  @Prop({ reflect: true }) trigger: any = undefined;

  @Prop({ reflect: true }) collapsedWidth: number | string = 80;

  @Prop({ reflect: true }) breakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' = undefined;

  @Prop({ reflect: true }) theme: 'light' | 'dark' = 'dark';

  @Event({}) beesBreakpoint: EventEmitter<{ broken: boolean }> = undefined;

  @Event({}) beesCollapse: EventEmitter<{ collapsed: boolean; type: 'clickTrigger' | 'responsive' }> = undefined;

  @Prop({ reflect: true }) zeroWidthTriggerStyle: CSSProperties = undefined;

  @State() config = useConfigInject('layout-sider', this);

  @State() siderHook = inject(SiderHookProviderKey, undefined);

  @State() _collapsed = shallowRef(!!(this.collapsed !== undefined ? this.collapsed : this.defaultCollapsed));

  @State() below = shallowRef(false);

  @Watch('collapsed')
  watchCollapsed() {
    this._collapsed.value = !!this.collapsed;
  }

  private handleSetCollapsed = (value: boolean, type: CollapseType) => {
    if (this.collapsed === undefined) {
      this._collapsed.value = value;
    }
    this.beesCollapse.emit({ collapsed: value, type });
  };

  private toggle = () => {
    this.handleSetCollapsed(!this._collapsed.value, 'clickTrigger');
  };

  render() {
    provide(SiderCollapsedKey, this._collapsed);

    const { prefixCls } = useConfigInject('layout-sider', this);
    const pre = prefixCls.value;
    const { collapsedWidth, width, reverseArrow, zeroWidthTriggerStyle, trigger, collapsible, theme } = this;
    const rawWidth = this._collapsed.value ? collapsedWidth : width;
    // use "px" as fallback unit for width
    const siderWidth = isNumeric(rawWidth) ? `${rawWidth}px` : String(rawWidth);
    // special trigger when collapsedWidth == 0
    const zeroWidthTrigger =
      parseFloat(String(collapsedWidth || 0)) === 0 ? (
        <span
          onClick={this.toggle}
          class={classNames(
            `${pre}-zero-width-trigger`,
            `${pre}-zero-width-trigger-${reverseArrow ? 'right' : 'left'}`,
          )}
          style={zeroWidthTriggerStyle as StencilCSS}
        >
          {trigger || chevronDown}
        </span>
      ) : null;
    const iconObj = {
      expanded: reverseArrow ? chevronDown : chevronDown,
      collapsed: reverseArrow ? chevronDown : chevronDown,
    };

    const status = this._collapsed.value ? 'collapsed' : 'expanded';
    const defaultTrigger = iconObj[status];
    const triggerDom =
      trigger !== null
        ? zeroWidthTrigger || (
            <div class={`${pre}-trigger`} onClick={this.toggle} style={{ width: siderWidth }}>
              {trigger || defaultTrigger}
            </div>
          )
        : null;
    const divStyle = {
      flex: `0 0 ${siderWidth}`,
      maxWidth: siderWidth, // Fix width transition bug in IE11
      minWidth: siderWidth, // https://github.com/ant-design/ant-design/issues/6349
      width: siderWidth,
    };
    const siderCls = classNames(pre, `${pre}-${theme}`, {
      [`${pre}-collapsed`]: !!this._collapsed.value,
      [`${pre}-has-trigger`]: collapsible && trigger !== null && !zeroWidthTrigger,
      [`${pre}-below`]: !!this.below.value,
      [`${pre}-zero-width`]: parseFloat(siderWidth) === 0,
    });
    return (
      <aside class={siderCls} style={divStyle}>
        <div class={`${pre}-children`}>
          <slot></slot>
        </div>
        {collapsible || (this.below.value && zeroWidthTrigger) ? triggerDom : null}
      </aside>
    );
  }
}
