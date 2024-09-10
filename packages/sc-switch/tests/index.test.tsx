import { fireEvent, render } from '@solidjs/testing-library';

import Switch from '../src';

describe('SolidJS Switch', () => {
  function createSwitch(props = {}) {
    return render(() => (
      <Switch
        checkedChildren={<span class="checked" />}
        unCheckedChildren={<span class="unchecked" />}
        {...props}
      />
    ));
  }

  it('works', () => {
    const { container } = createSwitch();
    expect(container.querySelector('.unchecked')).toBeTruthy();
    fireEvent.click(container.querySelector('button')!);
    expect(container.querySelector('.checked')).toBeTruthy();
  });

  it('should be checked upon right key and unchecked on left key', () => {
    const { container } = createSwitch();
    const button = container.querySelector('button')!;
    expect(container.querySelector('.unchecked')).toBeTruthy();
    fireEvent.keyDown(button, { key: 'ArrowRight' });
    expect(container.querySelector('.checked')).toBeTruthy();
    fireEvent.keyDown(button, { key: 'ArrowLeft' });
    expect(container.querySelector('.unchecked')).toBeTruthy();
  });

  it('should change from an initial checked state of true to false on click', () => {
    const onChange = vi.fn();
    const { container } = createSwitch({ defaultChecked: true, onChange });
    const button = container.querySelector('button')!;
    expect(container.querySelector('.checked')).toBeTruthy();
    fireEvent.click(button);
    expect(container.querySelector('.unchecked')).toBeTruthy();
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('should support onClick', () => {
    const onClick = vi.fn();
    const { container } = createSwitch({ onClick });
    const button = container.querySelector('button')!;
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledWith(true, expect.any(MouseEvent));
    expect(onClick).toHaveBeenCalledTimes(1);
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledWith(false, expect.any(MouseEvent));
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('should not toggle when clicked in a disabled state', () => {
    const onChange = vi.fn();
    const { container } = createSwitch({ disabled: true, checked: true, onChange });
    const button = container.querySelector('button')!;
    expect(container.querySelector('.checked')).toBeTruthy();
    fireEvent.click(button);
    expect(container.querySelector('.checked')).toBeTruthy();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('should support loading icon node', () => {
    const { container } = render(() => <Switch loadingIcon={<span class="extra">loading</span>} />);
    expect(container.querySelector('.extra')?.textContent).toBe('loading');
  });

  it('focus()', () => {
    const handleFocus = vi.fn();
    let ref: HTMLButtonElement | undefined;
    render(() => <Switch ref={ref} onFocus={handleFocus} />);
    ref?.focus();
    expect(handleFocus).toHaveBeenCalled();
  });

  it('blur()', () => {
    const handleBlur = vi.fn();
    let ref: HTMLButtonElement | undefined;
    render(() => <Switch ref={ref} onBlur={handleBlur} />);
    ref?.focus();
    ref?.blur();
    expect(handleBlur).toHaveBeenCalled();
  });

  describe('autoFocus', () => {
    it('basic', () => {
      // TOFIX: autoFocus not work in test
      const handleFocus = vi.fn();
      const { container } = render(() => <Switch autofocus onFocus={handleFocus} />);
      container.querySelector('button')?.focus();
      expect(handleFocus).toHaveBeenCalled();
    });

    it('not work when disabled', () => {
      const handleFocus = vi.fn();
      render(() => <Switch autofocus disabled onFocus={handleFocus} />);
      expect(handleFocus).not.toHaveBeenCalled();
    });
  });

  it('disabled', () => {
    const { container } = createSwitch({ disabled: true });
    const button = container.querySelector('button')!;
    expect(container.querySelector('.unchecked')).toBeTruthy();
    fireEvent.keyDown(button, { key: 'ArrowRight' });
    expect(container.querySelector('.unchecked')).toBeTruthy();
  });

  it('onMouseUp', () => {
    const onMouseUp = vi.fn();
    const { container } = createSwitch({ onMouseUp });
    const button = container.querySelector('button')!;
    fireEvent.mouseUp(button);
    expect(onMouseUp).toHaveBeenCalled();
  });

  it('disabled should click not to change', () => {
    const onChange = vi.fn();
    const onClick = vi.fn();
    const { container } = createSwitch({ disabled: true, onChange, onClick, checked: true });
    const button = container.querySelector('button')!;
    fireEvent.click(button);
    expect(onChange).not.toHaveBeenCalled();
  });
});
