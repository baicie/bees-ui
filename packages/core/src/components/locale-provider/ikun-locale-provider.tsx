import { Component, Host, Prop, State, Watch, h } from '@stencil/core';
import { Locale } from '../../locale';
import warning from '../../utils/warning';

@Component({
  tag: 'bees-locale-provider',
})
export class LocaleProvider {
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
