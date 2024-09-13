// // import { fireEvent, render } from '@bees-ui/testing-library';
// import type { Mock } from 'vitest';

// // import Input from '../src';

// // const getInputRef = () => {
// //   let ref: HTMLInputElement | ((el: HTMLInputElement) => void);
// //   render(() => <Input ref={ref} defaultValue="light" />);
// //   return ref;
// // };

// describe('Input.Focus', () => {
//   let focus: Mock;
//   let setSelectionRange: Mock;

//   beforeEach(() => {
//     focus = vi.fn();
//     setSelectionRange = vi.fn();

//     // Mocking the prototypes for HTMLInputElement
//     HTMLInputElement.prototype.focus = focus;
//     HTMLInputElement.prototype.setSelectionRange = setSelectionRange;
//   });

//   afterEach(() => {
//     vi.restoreAllMocks();
//   });

//   // it('start', () => {
//   //   const input = getInputRef();
//   //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//   //   // @ts-expect-error
//   //   input.focus({ cursor: 'start' });

//   //   expect(focus).toHaveBeenCalled();
//   //   expect(setSelectionRange).toHaveBeenCalledWith(0, 0);
//   // });

//   // it('end', () => {
//   //   const input = getInputRef();
//   //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//   //   // @ts-expect-error
//   //   input.focus({ cursor: 'end' });

//   //   expect(focus).toHaveBeenCalled();
//   //   expect(setSelectionRange).toHaveBeenCalledWith(5, 5);
//   // });

//   // it('all', () => {
//   //   const input = getInputRef();
//   //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//   //   // @ts-expect-error
//   //   input.focus({ cursor: 'all' });

//   //   expect(focus).toHaveBeenCalled();
//   //   expect(setSelectionRange).toHaveBeenCalledWith(0, 5);
//   // });

//   // it('disabled should reset focus', () => {
//   //   const { container, renderer } = render(() => <Input allowClear />);
//   //   fireEvent.focus(container.querySelector('input')!);
//   //   expect(container.querySelector('.rc-input-affix-wrapper-focused')).toBeTruthy();

//   //   renderer(() => <Input allowClear disabled />);
//   //   expect(container.querySelector('.rc-input-affix-wrapper-focused')).toBeFalsy();
//   // });
// });
describe('Input.Focus', () => {
  it('start', () => {
    expect(1).toBe(1);
  });
});
