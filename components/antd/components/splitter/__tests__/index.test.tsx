import React from 'react';
import type { GetProps, SplitterProps } from 'antd';
import { ConfigProvider, Splitter } from 'antd';
import { spyElementPrototypes } from 'rc-util/lib/test/domHook';

import { resetWarned } from '../../_util/warning';
import {
  act,
  createEvent,
  fireEvent,
  render,
  triggerResize,
  waitFakeTimer,
} from '../../../tests/utils';

type PanelProps = GetProps<typeof Splitter.Panel>;

const SplitterDemo = ({ items = [{}, {}], ...props }: { items?: PanelProps[] } & SplitterProps) => (
  <Splitter {...props}>
    {items?.map((item, idx) => {
      const key = `panel-${idx}`;
      return <Splitter.Panel key={key} {...item} />;
    })}
  </Splitter>
);

describe('Splitter', () => {
  const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  let containerSize = 100;

  beforeAll(() => {
    spyElementPrototypes(HTMLElement, {
      offsetWidth: {
        get: () => containerSize,
      },
      offsetHeight: {
        get: () => containerSize,
      },
    });
  });

  beforeEach(() => {
    containerSize = 100;
    errSpy.mockReset();
    resetWarned();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should correct render', () => {
    const { container } = render(<SplitterDemo />);
    expect(container.querySelector('.ant-splitter')).toBeTruthy();
    expect(container.querySelectorAll('.ant-splitter-panel')).toHaveLength(2);
    expect(container.querySelector('.ant-splitter-bar')).toBeTruthy();
  });

  it('should correct render panel size', async () => {
    const { container } = render(<SplitterDemo items={[{ size: 20 }, { size: '45%' }, {}]} />);

    const panels = container.querySelectorAll('.ant-splitter-panel');

    expect(panels?.[0]).toHaveStyle('flex-basis: 20px');
    expect(panels?.[1]).toHaveStyle('flex-basis: 45px');
    expect(panels?.[2]).toHaveStyle('flex-basis: 35px');
  });

  it('The layout should work fine', () => {
    const { container, rerender } = render(<SplitterDemo />);
    expect(container.querySelector('.ant-splitter-horizontal')).toBeTruthy();

    rerender(<SplitterDemo items={[{}, {}, {}]} layout="vertical" />);
    expect(container.querySelector('.ant-splitter-vertical')).toBeTruthy();
  });

  it('The resizable should work fine', () => {
    const { container, rerender } = render(
      <SplitterDemo items={[{ size: 20 }, { resizable: false }, {}]} />,
    );
    expect(container.querySelectorAll('.ant-splitter-bar-dragger')).toHaveLength(2);
    expect(container.querySelectorAll('.ant-splitter-bar-dragger-disabled')).toHaveLength(2);

    rerender(<SplitterDemo items={[{ size: 20 }, {}, { resizable: false }]} />);
    expect(container.querySelectorAll('.ant-splitter-bar-dragger')).toHaveLength(2);
    expect(container.querySelectorAll('.ant-splitter-bar-dragger-disabled')).toHaveLength(1);
  });

  it('Splitter.Panel is syntactic sugar', () => {
    const { container } = render(<Splitter.Panel />);
    expect(container.innerHTML).toEqual('');
  });

  // ============================== Resizable ==============================
  describe('drag', () => {
    function mockDrag(draggerEle: HTMLElement, offset: number) {
      // Down
      const downEvent = createEvent.mouseDown(draggerEle);
      (downEvent as any).pageX = 0;
      (downEvent as any).pageY = 0;

      fireEvent(draggerEle, downEvent);

      // Move
      const moveEvent = createEvent.mouseMove(draggerEle);
      (moveEvent as any).pageX = offset;
      (moveEvent as any).pageY = offset;
      fireEvent(draggerEle, moveEvent);

      // Up
      fireEvent.mouseUp(draggerEle);
    }

    it('The mousemove should work fine', async () => {
      const onResize = jest.fn();
      const onResizeEnd = jest.fn();

      const { container } = render(
        <SplitterDemo items={[{}, {}]} onResize={onResize} onResizeEnd={onResizeEnd} />,
      );

      // Right
      mockDrag(container.querySelector('.ant-splitter-bar-dragger')!, 40);
      expect(onResize).toHaveBeenCalledWith([90, 10]);
      expect(onResizeEnd).toHaveBeenCalledWith([90, 10]);

      // Left
      mockDrag(container.querySelector('.ant-splitter-bar-dragger')!, -200);
      expect(onResize).toHaveBeenCalledWith([0, 100]);
      expect(onResizeEnd).toHaveBeenCalledWith([0, 100]);
    });

    it('with min', () => {
      const onResize = jest.fn();
      const onResizeEnd = jest.fn();

      const { container } = render(
        <SplitterDemo items={[{ min: 10 }, {}]} onResize={onResize} onResizeEnd={onResizeEnd} />,
      );

      mockDrag(container.querySelector('.ant-splitter-bar-dragger')!, -100);
      expect(onResize).toHaveBeenCalledWith([10, 90]);
      expect(onResizeEnd).toHaveBeenCalledWith([10, 90]);
    });

    it('with max', () => {
      const onResize = jest.fn();
      const onResizeEnd = jest.fn();

      const { container } = render(
        <SplitterDemo items={[{ max: 90 }, {}]} onResize={onResize} onResizeEnd={onResizeEnd} />,
      );

      mockDrag(container.querySelector('.ant-splitter-bar-dragger')!, 100);
      expect(onResize).toHaveBeenCalledWith([90, 10]);
      expect(onResizeEnd).toHaveBeenCalledWith([90, 10]);
    });

    it('both panel has min and max', () => {
      const onResize = jest.fn();
      const onResizeEnd = jest.fn();

      const { container } = render(
        <SplitterDemo
          items={[
            { min: 10, max: 80 },
            { min: 10, max: 80 },
          ]}
          onResize={onResize}
          onResizeEnd={onResizeEnd}
        />,
      );

      mockDrag(container.querySelector('.ant-splitter-bar-dragger')!, -100);
      expect(onResize).toHaveBeenCalledWith([20, 80]);
      expect(onResizeEnd).toHaveBeenCalledWith([20, 80]);

      mockDrag(container.querySelector('.ant-splitter-bar-dragger')!, 100);
      expect(onResize).toHaveBeenCalledWith([80, 20]);
      expect(onResizeEnd).toHaveBeenCalledWith([80, 20]);
    });

    it('rtl', () => {
      const onResize = jest.fn();
      const onResizeEnd = jest.fn();

      const { container } = render(
        <ConfigProvider direction="rtl">
          <SplitterDemo items={[{}, {}]} onResize={onResize} onResizeEnd={onResizeEnd} />
        </ConfigProvider>,
      );

      mockDrag(container.querySelector('.ant-splitter-bar-dragger')!, -40);
      expect(onResize).toHaveBeenCalledWith([90, 10]);
      expect(onResizeEnd).toHaveBeenCalledWith([90, 10]);
    });

    it('[true, 0, true] can be move left', () => {
      const onResize = jest.fn();
      const onResizeEnd = jest.fn();

      const { container } = render(
        <SplitterDemo
          items={[{}, { defaultSize: 0 }, {}]}
          onResize={onResize}
          onResizeEnd={onResizeEnd}
        />,
      );

      mockDrag(container.querySelectorAll<HTMLDivElement>('.ant-splitter-bar-dragger')[1], -100);
      expect(onResize).toHaveBeenCalledWith([0, 50, 50]);
      expect(onResizeEnd).toHaveBeenCalledWith([0, 50, 50]);
    });

    it('[false, 0, true] can not be move left', () => {
      const onResize = jest.fn();
      const onResizeEnd = jest.fn();

      const { container } = render(
        <SplitterDemo
          items={[{ resizable: false }, { defaultSize: 0 }, {}]}
          onResize={onResize}
          onResizeEnd={onResizeEnd}
        />,
      );

      mockDrag(container.querySelectorAll<HTMLDivElement>('.ant-splitter-bar-dragger')[1], -100);
      expect(onResize).toHaveBeenCalledWith([50, 0, 50]);
      expect(onResizeEnd).toHaveBeenCalledWith([50, 0, 50]);
    });
  });

  // ============================= Collapsible =============================
  describe('collapsible', () => {
    it('Basic', () => {
      const { container, rerender } = render(
        <SplitterDemo items={[{ size: 20, collapsible: true }, { collapsible: true }]} />,
      );

      expect(container.querySelectorAll('.ant-splitter-bar-collapse-icon')).toHaveLength(2);
      expect(container.querySelector('.ant-splitter-bar-collapse-start')).toBeTruthy();
      expect(container.querySelector('.ant-splitter-bar-collapse-end')).toBeTruthy();

      // support collapsible is object
      rerender(
        <SplitterDemo
          items={[
            {
              size: 20,
              collapsible: true,
            },
            {
              collapsible: true,
            },
            {},
          ]}
        />,
      );

      expect(container.querySelectorAll('.ant-splitter-bar-collapse-start')).toHaveLength(2);
      expect(container.querySelectorAll('.ant-splitter-bar-collapse-end')).toHaveLength(1);
    });

    it('collapsible - true', () => {
      const onResize = jest.fn();
      const onResizeEnd = jest.fn();

      const { container } = render(
        <SplitterDemo
          items={[
            {
              size: 20,
              collapsible: true,
            },
            {},
          ]}
          onResize={onResize}
          onResizeEnd={onResizeEnd}
        />,
      );

      fireEvent.click(container.querySelector('.ant-splitter-bar-collapse-start')!);
      expect(onResize).toHaveBeenCalledWith([0, 100]);
      expect(onResizeEnd).toHaveBeenCalledWith([0, 100]);
    });

    it('collapsible - start:true', () => {
      const onResize = jest.fn();
      const onResizeEnd = jest.fn();

      const { container } = render(
        <SplitterDemo
          items={[
            {},
            {
              size: 20,
              collapsible: {
                start: true,
              },
            },
            {},
          ]}
          onResize={onResize}
          onResizeEnd={onResizeEnd}
        />,
      );

      expect(container.querySelector('.ant-splitter-bar-collapse-start')).toBeFalsy();
      expect(container.querySelector('.ant-splitter-bar-collapse-end')).toBeTruthy();

      fireEvent.click(container.querySelector('.ant-splitter-bar-collapse-end')!);
      expect(onResize).toHaveBeenCalledWith([60, 0, 40]);
      expect(onResizeEnd).toHaveBeenCalledWith([60, 0, 40]);
    });

    it('collapsible - end:true', () => {
      const onResize = jest.fn();
      const onResizeEnd = jest.fn();

      const { container } = render(
        <SplitterDemo
          items={[
            {},
            {
              size: 20,
              collapsible: {
                end: true,
              },
            },
            {},
          ]}
          onResize={onResize}
          onResizeEnd={onResizeEnd}
        />,
      );

      expect(container.querySelector('.ant-splitter-bar-collapse-start')).toBeTruthy();
      expect(container.querySelector('.ant-splitter-bar-collapse-end')).toBeFalsy();

      fireEvent.click(container.querySelector('.ant-splitter-bar-collapse-start')!);
      expect(onResize).toHaveBeenCalledWith([40, 0, 60]);
      expect(onResizeEnd).toHaveBeenCalledWith([40, 0, 60]);
    });

    it('both collapsible', () => {
      const onResize = jest.fn();
      const onResizeEnd = jest.fn();

      const { container } = render(
        <SplitterDemo
          items={[
            {
              collapsible: true,
            },
            {
              collapsible: true,
            },
          ]}
          onResize={onResize}
          onResizeEnd={onResizeEnd}
        />,
      );

      function expectClick(element: HTMLElement, size: number[]) {
        onResize.mockReset();
        onResizeEnd.mockReset();

        fireEvent.click(element);
        expect(onResize).toHaveBeenCalledWith(size);
        expect(onResizeEnd).toHaveBeenCalledWith(size);
      }

      expectClick(container.querySelector('.ant-splitter-bar-collapse-start')!, [0, 100]);
      expectClick(container.querySelector('.ant-splitter-bar-collapse-end')!, [50, 50]);
      expectClick(container.querySelector('.ant-splitter-bar-collapse-end')!, [100, 0]);
      expectClick(container.querySelector('.ant-splitter-bar-collapse-start')!, [50, 50]);
    });

    it('collapsible with min', () => {
      const onResize = jest.fn();
      const onResizeEnd = jest.fn();

      const { container } = render(
        <SplitterDemo
          items={[
            {
              defaultSize: 20,
              collapsible: true,
              min: 10,
            },
            {
              collapsible: true,
              min: '80%',
            },
          ]}
          onResize={onResize}
          onResizeEnd={onResizeEnd}
        />,
      );

      // Collapse left
      fireEvent.click(container.querySelector('.ant-splitter-bar-collapse-start')!);
      expect(onResize).toHaveBeenCalledWith([0, 100]);
      expect(onResizeEnd).toHaveBeenCalledWith([0, 100]);
      expect(container.querySelector('.ant-splitter-bar-dragger-disabled')).toBeTruthy();

      // Collapse back
      onResize.mockReset();
      onResizeEnd.mockReset();
      fireEvent.click(container.querySelector('.ant-splitter-bar-collapse-end')!);
      expect(onResize).toHaveBeenCalledWith([5, 95]);
      expect(onResizeEnd).toHaveBeenCalledWith([5, 95]);
      expect(container.querySelector('.ant-splitter-bar-dragger-disabled')).toBeFalsy();

      // Collapse right
      onResize.mockReset();
      onResizeEnd.mockReset();
      fireEvent.click(container.querySelector('.ant-splitter-bar-collapse-end')!);
      expect(onResize).toHaveBeenCalledWith([100, 0]);
      expect(onResizeEnd).toHaveBeenCalledWith([100, 0]);
      expect(container.querySelector('.ant-splitter-bar-dragger-disabled')).toBeTruthy();
    });
  });

  it('auto resize', async () => {
    containerSize = 200;

    const onResize = jest.fn();
    const { container } = render(
      <SplitterDemo
        items={[
          {
            collapsible: true,
          },
          {},
        ]}
        onResize={onResize}
      />,
    );

    triggerResize(container.querySelector('.ant-splitter')!);

    await act(async () => {
      await waitFakeTimer();
    });

    fireEvent.click(container.querySelector('.ant-splitter-bar-collapse-start')!);
    expect(onResize).toHaveBeenCalledWith([0, 200]);
  });
});
