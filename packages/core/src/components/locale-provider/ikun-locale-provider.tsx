import { Component, Host, Prop, State, Watch, h } from '@stencil/core';
import { Locale } from '../../locale';
import warning from '../../utils/warning';

@Component({
  tag: 'ikun-locale-provider',
})
export class IkunLocaleProvider {
  @Prop() locale: Locale | undefined;

  @State() state: Locale | undefined;

  @Watch('locale')
  localeChanged(locale: Locale) {
    Object.assign({}, this.state, locale);
    warning(true, 'localeChanged');
  }

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
