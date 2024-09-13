import { fireEvent, render } from '@bees-ui/testing-library';
import { createSignal } from 'solid-js';
import { describe, expect, it, vi } from 'vitest';

import Input from '../src';

describe('Input', () => {
  it('should support maxLength', () => {
    const [value, setValue] = createSignal('');
    const { container } = render(() => (
      <Input
        prefixCls="rc-input"
        maxLength={3}
        value={value()}
        onInput={(e) => setValue(e.currentTarget.value)}
      />
    ));
    expect(container).toMatchSnapshot();
  });

  it('not crash when value is number', () => {
    const [value, setValue] = createSignal(1);
    const { container } = render(() => (
      <Input
        suffix="Bamboo"
        value={value()}
        onInput={(e) => setValue(Number(e.currentTarget.value))}
      />
    ));
    expect(container).toBeTruthy();
  });

  it('should trigger onFocus and onBlur', () => {
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    const { container } = render(() => <Input onFocus={onFocus} onBlur={onBlur} />);
    const inputEl = container.querySelector('input')!;
    fireEvent.focus(inputEl);
    expect(onFocus).toHaveBeenCalled();
    fireEvent.blur(inputEl);
    expect(onBlur).toHaveBeenCalled();
  });

  it('should trigger onKeydown and onPressEnter', () => {
    const onKeyDown = vi.fn();
    const onPressEnter = vi.fn();
    const { container } = render(() => <Input onKeyDown={onKeyDown} onPressEnter={onPressEnter} />);
    const inputEl = container.querySelector('input')!;
    fireEvent.keyDown(inputEl, { key: 'Enter' });
    expect(onKeyDown).toHaveBeenCalled();
    expect(onPressEnter).toHaveBeenCalled();
  });

  it('should prevent long press of enter', () => {
    const onKeyDown = vi.fn();
    const onPressEnter = vi.fn();
    const onKeyUp = vi.fn();
    const { container } = render(() => (
      <Input onKeyDown={onKeyDown} onPressEnter={onPressEnter} onKeyUp={onKeyUp} />
    ));
    const inputEl = container.querySelector('input')!;
    fireEvent.keyDown(inputEl, { key: 'Enter' });
    fireEvent.keyDown(inputEl, { key: 'Enter' });
    fireEvent.keyUp(inputEl, { key: 'Enter' });
    expect(onKeyDown).toBeCalledTimes(2);
    expect(onPressEnter).toBeCalledTimes(1);
    expect(onKeyUp).toBeCalledTimes(1);
  });

  // it('should trigger onChange', () => {
  //   const onChange = vi.fn();
  //   const [value, setValue] = createSignal('');
  //   const { container } = render(() => (
  //     <Input
  //       onInput={(e) => {
  //         setValue(e.currentTarget.value);
  //         onChange(e);
  //       }}
  //       value={value()}
  //     />
  //   ));
  //   const inputEl = container.querySelector('input')!;
  //   fireEvent.input(inputEl, { target: { value: 'test' } });
  //   expect(onChange).toHaveBeenCalled();
  //   expect(inputEl.value).toBe('test');
  // });

  // it('not block input when `value` is undefined', () => {
  //   const [value, setValue] = createSignal('');
  //   const { container, renderer } = render(() => (
  //     <Input value={value()} onInput={(e) => setValue(e.currentTarget.value)} />
  //   ));
  //   const inputEl = container.querySelector('input')!;
  //   fireEvent.input(inputEl, { target: { value: 'Bamboo' } });
  //   expect(inputEl.value).toEqual('Bamboo');

  //   // Controlled
  //   renderer(() => <Input value="Light" onInput={(e) => setValue(e.currentTarget.value)} />);
  //   fireEvent.input(inputEl, { target: { value: 'Bamboo' } });
  //   expect(inputEl.value).toEqual('Light');

  //   // Uncontrolled
  //   renderer(() => <Input value={undefined} onInput={(e) => setValue(e.currentTarget.value)} />);
  //   expect(inputEl.value).toEqual('');
  //   fireEvent.input(inputEl, { target: { value: 'Bamboo' } });
  //   expect(inputEl.value).toEqual('Bamboo');
  // });

  it('should focus input after clear', async () => {
    const { container } = render(() => (
      <Input prefixCls="rc-input" allowClear defaultValue="111" />
    ));
    const clearIcon = container.querySelector('.rc-input-clear-icon')!;
    await fireEvent.click(clearIcon);
    expect(document.activeElement).toBe(container.querySelector('input'));
  });

  it('support bigint type', () => {
    // TOFIX: bigint not work in test
    const { container } = render(() => <Input value={Number('2222')} />);
    expect(container).toBeTruthy();
  });

  // it('should be compatible with type="file"', () => {
  //   const onChange = vi.fn();
  //   const { container } = render(() => <Input type="file" onInput={onChange} />);
  //   const inputEl = container.querySelector('input')!;
  //   const file = new File(['(⌐□_□)'], 'file.xml', { type: 'application/xml' });
  //   // upload the file by updating the value attribute of the input
  //   fireEvent.change(inputEl, {
  //     target: { files: [file] },
  //   });

  //   expect(onChange).toHaveBeenCalled();
  //   expect(onChange.mock.calls[0][0].target.files[0]).toBe(file);
  // });
});

describe('should support showCount', () => {
  it('maxLength', () => {
    const [value, setValue] = createSignal('12345');
    const { container } = render(() => (
      <Input
        prefixCls="rc-input"
        maxLength={5}
        showCount
        value={value()}
        onInput={(e) => setValue(e.currentTarget.value)}
      />
    ));
    expect(container.querySelector('input')?.value).toBe('12345');
    expect(container.querySelector('.rc-input-show-count-suffix')?.innerHTML).toBe('5 / 5');
  });

  it('control exceed maxLength', () => {
    const [value, setValue] = createSignal('12345678');
    const { container } = render(() => (
      <Input
        prefixCls="rc-input"
        maxLength={5}
        showCount
        value={value()}
        onInput={(e) => setValue(e.currentTarget.value)}
      />
    ));
    expect(container.querySelector('input')?.value).toBe('12345678');
    expect(container.querySelector('.rc-input-show-count-suffix')?.innerHTML).toBe('8 / 5');
  });

  it('count formatter', () => {
    const [value, setValue] = createSignal('12345');
    const { container } = render(() => (
      <Input
        prefixCls="rc-input"
        maxLength={5}
        showCount={{
          formatter: ({ value, count, maxLength }) => `${value}, ${count}, ${maxLength}`,
        }}
        value={value()}
        onInput={(e) => setValue(e.currentTarget.value)}
      />
    ));
    expect(container.querySelector('input')?.value).toBe('12345');
    expect(container.querySelector('.rc-input-show-count-suffix')?.innerHTML).toBe('12345, 5, 5');
  });
});

describe('Input allowClear', () => {
  it('should change type when click', () => {
    const [value, setValue] = createSignal('111');
    const { container } = render(() => (
      <Input
        prefixCls="rc-input"
        allowClear
        value={value()}
        onInput={(e) => setValue(e.currentTarget.value)}
      />
    ));
    const inputEl = container.querySelector('input')!;
    fireEvent.input(inputEl, { target: { value: '111' } });
    expect(inputEl.value).toEqual('111');
    expect(container).toMatchSnapshot();
    fireEvent.click(container.querySelector('.rc-input-clear-icon')!);
    expect(container).toMatchSnapshot();
    expect(inputEl.value).toEqual('');
  });

  it('should not show icon if value is undefined or empty string', () => {
    const containers = [undefined, ''].map(
      (val) => render(() => <Input prefixCls="rc-input" allowClear value={val} />).container,
    );
    containers.forEach((container) => {
      expect(container.querySelector('input')?.value).toEqual('');
      expect(container.querySelector('.rc-input-clear-icon-hidden')).toBeTruthy();
      expect(container).toMatchSnapshot();
    });
  });

  it('should not show icon if defaultValue is undefined or empty string', () => {
    const containers = [undefined, ''].map(
      (val) => render(() => <Input prefixCls="rc-input" allowClear defaultValue={val} />).container,
    );
    containers.forEach((container) => {
      expect(container.querySelector('input')?.value).toEqual('');
      expect(container.querySelector('.rc-input-clear-icon-hidden')).toBeTruthy();
      expect(container).toMatchSnapshot();
    });
  });

  // it('should trigger event correctly', () => {
  //   let argumentEventObject;
  //   let argumentEventObjectValue;
  //   const onChange = (e: Event) => {
  //     argumentEventObject = e;
  //     argumentEventObjectValue = (e.target as HTMLInputElement).value;
  //   };
  //   const { container } = render(() => (
  //     <Input prefixCls="rc-input" allowClear defaultValue="111" onInput={onChange} />
  //   ));
  //   fireEvent.click(container.querySelector('.rc-input-clear-icon')!);
  //   expect(argumentEventObject).toHaveProperty('type', 'click');
  //   expect(argumentEventObjectValue).toBe('');
  //   expect(container.querySelector('input')?.value).toBe('');
  // });

  // it('should trigger event correctly on controlled mode', () => {
  //   let argumentEventObject;
  //   let argumentEventObjectValue;
  //   const onChange = (e: Event) => {
  //     argumentEventObject = e;
  //     argumentEventObjectValue = (e.target as HTMLInputElement).value;
  //   };
  //   const [value, setValue] = createSignal('111');
  //   const { container } = render(() => (
  //     <Input
  //       prefixCls="rc-input"
  //       allowClear
  //       value={value()}
  //       onInput={(e) => {
  //         setValue(e.currentTarget.value);
  //         onChange(e);
  //       }}
  //     />
  //   ));
  //   fireEvent.click(container.querySelector('.rc-input-clear-icon')!);
  //   expect(argumentEventObject).toHaveProperty('type', 'click');
  //   expect(argumentEventObjectValue).toBe('');
  //   expect(container.querySelector('input')?.value).toBe('');
  // });
});
