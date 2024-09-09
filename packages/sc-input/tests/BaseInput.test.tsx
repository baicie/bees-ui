import { fireEvent, render } from '@solidjs/testing-library';
import { createSignal } from 'solid-js';

import BaseInput from '../src/BaseInput';

describe('BaseInput', () => {
  it('should render perfectly', () => {
    const { container } = render(() => (
      <BaseInput prefixCls="rc-input">
        <input />
      </BaseInput>
    ));
    expect(container).toMatchSnapshot();
  });

  it('prefix and suffix should render properly', () => {
    const { container } = render(() => (
      <div>
        <BaseInput prefixCls="rc-input" prefix="prefix">
          <input />
        </BaseInput>
        <br />
        <br />
        <BaseInput prefixCls="rc-input" suffix="suffix">
          <input />
        </BaseInput>
      </div>
    ));
    expect(container).toMatchSnapshot();
  });

  it('addon should render properly', () => {
    const { container } = render(() => (
      <div>
        <BaseInput prefixCls="rc-input" addonBefore="addonBefore">
          <input />
        </BaseInput>
        <br />
        <br />
        <BaseInput prefixCls="rc-input" addonAfter="addonAfter">
          <input />
        </BaseInput>
      </div>
    ));
    expect(container).toMatchSnapshot();
  });

  it('allowClear should work', () => {
    const onChange = vitest.fn();
    const onBlur = vitest.fn();
    const onFocus = vitest.fn();

    const Demo = () => {
      const [value, setValue] = createSignal('');

      const handleReset = () => {
        setValue('');
      };

      const handleChange = (e: Event) => {
        onChange();
        setValue((e.target as HTMLInputElement).value);
      };

      return (
        <BaseInput
          prefixCls="rc-input"
          allowClear={{ clearIcon: '✖' }}
          value={value()}
          handleReset={handleReset}
        >
          <input onChange={handleChange} onBlur={onBlur} onFocus={onFocus} />
        </BaseInput>
      );
    };

    const { container } = render(() => <Demo />);

    const inputEl = container.querySelector('input');
    fireEvent.focus(inputEl!);
    expect(onFocus).toHaveBeenCalledTimes(1);

    fireEvent.change(inputEl!, { target: { value: 'some text' } });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(inputEl!.value).toBe('some text');

    const clearIcon = container.querySelector('.rc-input-clear-icon');
    fireEvent.mouseDown(clearIcon!);
    fireEvent.click(clearIcon!);
    fireEvent.mouseUp(clearIcon!);
    expect(onBlur).not.toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(inputEl!.value).toBe('');
  });

  it('should display clearIcon correctly', () => {
    const { container, unmount } = render(() => (
      <BaseInput prefixCls="rc-input" allowClear>
        <input />
      </BaseInput>
    ));
    const clearIcon = container.querySelector('.rc-input-clear-icon');
    expect(clearIcon?.innerHTML).toBe('✖');

    unmount();

    render(() => (
      <BaseInput prefixCls="rc-input" allowClear={{ clearIcon: 'clear' }}>
        <input />
      </BaseInput>
    ));
    expect(clearIcon?.innerHTML).toBe('clear');
  });

  it('should focus input when click prefix', () => {
    let inputRef: HTMLInputElement | null = null;
    const { container } = render(() => (
      <BaseInput prefixCls="rc-input" triggerFocus={() => inputRef?.focus()} prefix="$">
        <input ref={(el) => (inputRef = el)} />
      </BaseInput>
    ));
    fireEvent.click(container.querySelector('.rc-input-affix-wrapper')!);
    expect(document.activeElement).toBe(inputRef);
  });

  it('should support data-*', () => {
    const { container } = render(() => (
      <BaseInput
        prefixCls="rc-input"
        prefix="prefix"
        dataAttrs={{
          affixWrapper: {
            'data-test': 'test',
          },
        }}
      >
        <input />
      </BaseInput>
    ));
    expect(container.querySelector('.rc-input-affix-wrapper')?.getAttribute('data-test')).toBe(
      'test',
    );
  });

  it('should apply className to inputElement', () => {
    const { container } = render(() => (
      <BaseInput prefixCls="rc-input" className="test-base">
        <input class="test" />
      </BaseInput>
    ));
    expect(container.querySelector('.test-base')).toBeTruthy();
    expect(container.querySelector('.test')).toBeTruthy();
  });

  it('should not pass className to inputElement when has addon', () => {
    const { container } = render(() => (
      <BaseInput prefixCls="rc-input" className="test-base" addonBefore="addon">
        <input class="test" />
      </BaseInput>
    ));
    expect(container.querySelector('input')?.classList.contains('test')).toBeTruthy();
    expect(container.querySelector('input')?.classList.contains('test-base')).toBeFalsy();
  });

  it('should correct render with prefix and addon', () => {
    const { container } = render(() => (
      <BaseInput prefixCls="rc-input" prefix="prefix" addonBefore="addon">
        <input />
      </BaseInput>
    ));
    expect(container).toMatchSnapshot();
  });

  it('support use div as basic element', () => {
    const { container } = render(() => (
      <BaseInput
        prefixCls="rc-input"
        prefix="prefix"
        addonBefore="addon"
        components={{
          affixWrapper: 'div',
          groupWrapper: 'div',
          wrapper: 'div',
          groupAddon: 'div',
        }}
      >
        <input />
      </BaseInput>
    ));
    expect(container).toMatchSnapshot();
  });

  it('styles should work', () => {
    const container = render(() => (
      <BaseInput
        prefixCls="rc-input"
        prefix="prefix"
        addonBefore="addon"
        styles={{
          affixWrapper: {
            color: 'red',
          },
          prefix: {
            color: 'blue',
          },
        }}
      >
        <input />
      </BaseInput>
    ));

    expect(
      container.container.querySelector<HTMLSpanElement>('.rc-input-affix-wrapper')?.style.color,
    ).toBe('red');
    expect(
      container.container.querySelector<HTMLSpanElement>('.rc-input-prefix')?.style.color,
    ).toBe('blue');
  });

  it('with addon and disabled', () => {
    const { container } = render(() => (
      <BaseInput prefixCls="rc-input" addonBefore="addon" disabled>
        <input />
      </BaseInput>
    ));

    expect(container.firstChild).toHaveClass('rc-input-group-wrapper-disabled');
  });

  it('variant cls', () => {
    const { container, unmount } = render(() => (
      <BaseInput prefixCls="rc-input" prefix="$" classNames={{ variant: 'test-variant' }} disabled>
        <input />
      </BaseInput>
    ));

    expect(container.querySelector('.rc-input-affix-wrapper')).toHaveClass('test-variant');
    expect(container.querySelector('input')).not.toHaveClass('test-variant');

    unmount();

    render(() => (
      <BaseInput prefixCls="rc-input" classNames={{ variant: 'test-variant' }} disabled>
        <input />
      </BaseInput>
    ));

    expect(container.querySelector('.rc-input-affix-wrapper')).toBeFalsy();
    expect(container.querySelector('input')).toHaveClass('test-variant');
  });

  describe('ref', () => {
    it('prefix', () => {
      let holderRef: any = null;
      const { container } = render(() => (
        <BaseInput prefixCls="rc-input" prefix="prefix" ref={(el) => (holderRef = el)}>
          <input />
        </BaseInput>
      ));
      expect(holderRef?.nativeElement).toBe(container.querySelector('.rc-input-affix-wrapper'));
    });

    it('addon', () => {
      let holderRef: any = null;
      const { container } = render(() => (
        <BaseInput prefixCls="rc-input" addonAfter="after" ref={(el) => (holderRef = el)}>
          <input />
        </BaseInput>
      ));

      expect(holderRef?.nativeElement).toBe(container.querySelector('.rc-input-group-wrapper'));
    });

    it('mix', () => {
      let holderRef: any = null;
      const { container } = render(() => (
        <BaseInput
          prefixCls="rc-input"
          suffix="suffix"
          addonAfter="after"
          ref={(el) => (holderRef = el)}
        >
          <input />
        </BaseInput>
      ));

      expect(holderRef?.nativeElement).toBe(container.querySelector('.rc-input-group-wrapper'));
    });

    it('support onClear', () => {
      const onClear = vitest.fn();
      const { container } = render(() => (
        <BaseInput prefixCls="rc-input" onClear={onClear} allowClear>
          <input value="test" />
        </BaseInput>
      ));
      fireEvent.click(container.querySelector<HTMLSpanElement>('.rc-input-clear-icon')!);
      expect(onClear).toHaveBeenCalled();
    });
  });
});
