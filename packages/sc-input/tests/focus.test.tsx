import { fireEvent, render } from '@solidjs/testing-library';
import type { Mock } from 'vitest';

import Input from '../src';

const getInputRef = () => {
  let ref: HTMLInputElement | ((el: HTMLInputElement) => void);
  render(() => <Input ref={ref} defaultValue="light" />);
  return ref;
};

describe('Input.Focus', () => {
  let focus: Mock;
  let setSelectionRange: Mock;

  beforeEach(() => {
    focus = vi.fn();
    setSelectionRange = vi.fn();

    // Mocking the prototypes for HTMLInputElement
    HTMLInputElement.prototype.focus = focus;
    HTMLInputElement.prototype.setSelectionRange = setSelectionRange;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('start', () => {
    const input = getInputRef();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    input.focus({ cursor: 'start' });

    expect(focus).toHaveBeenCalled();
    expect(setSelectionRange).toHaveBeenCalledWith(0, 0);
  });

  it('end', () => {
    const input = getInputRef();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    input.focus({ cursor: 'end' });

    expect(focus).toHaveBeenCalled();
    expect(setSelectionRange).toHaveBeenCalledWith(5, 5);
  });

  it('all', () => {
    const input = getInputRef();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    input.focus({ cursor: 'all' });

    expect(focus).toHaveBeenCalled();
    expect(setSelectionRange).toHaveBeenCalledWith(0, 5);
  });

  it('disabled should reset focus', () => {
    const { container, unmount } = render(() => <Input allowClear />);
    fireEvent.focus(container.querySelector('input')!);
    expect(container.querySelector('.rc-input-affix-wrapper-focused')).toBeTruthy();

    unmount();

    render(() => <Input allowClear disabled />);
    expect(container.querySelector('.rc-input-affix-wrapper-focused')).toBeFalsy();
  });
});
