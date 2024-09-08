import type { Component } from 'solid-js';
import { createComponent } from 'solid-js';

import type { BaseInputProps, InputProps } from '../interface';

export function hasAddon(props: BaseInputProps | InputProps) {
  return !!(props.addonBefore || props.addonAfter);
}

export function hasPrefixSuffix(props: BaseInputProps | InputProps) {
  return !!(props.prefix || props.suffix || props.allowClear);
}

function cloneEvent<
  EventType extends Event,
  Element extends HTMLInputElement | HTMLTextAreaElement,
>(event: EventType, target: Element, value: any): EventType {
  const currentTarget = target.cloneNode(true) as Element;

  // click clear icon
  const newEvent = Object.create(event, {
    target: { value: currentTarget },
    currentTarget: { value: currentTarget },
  });

  // Fill data
  currentTarget.value = value;

  // Fill selection. Some types like `email` do not support selection ranges
  if (typeof target.selectionStart === 'number' && typeof target.selectionEnd === 'number') {
    currentTarget.selectionStart = target.selectionStart;
    currentTarget.selectionEnd = target.selectionEnd;
  }

  currentTarget.setSelectionRange = (...args) => {
    target.setSelectionRange(...args);
  };

  return newEvent;
}

export function resolveOnChange<E extends HTMLInputElement | HTMLTextAreaElement>(
  target: E,
  e: Event | MouseEvent | CompositionEvent,
  onChange: undefined | ((event: Event) => void),
  targetValue?: string,
) {
  if (!onChange) return;

  let event = e;

  if (e.type === 'click') {
    // Clone a new target for the event.
    event = cloneEvent(e, target, '');

    onChange(event as Event);
    return;
  }

  // Handle composition event; we need to force change the input value
  if (target.type !== 'file' && targetValue !== undefined) {
    event = cloneEvent(e, target, targetValue);
    onChange(event as Event);
    return;
  }

  onChange(event as Event);
}

export interface InputFocusOptions extends FocusOptions {
  cursor?: 'start' | 'end' | 'all';
}

export function triggerFocus(
  element?: HTMLInputElement | HTMLTextAreaElement,
  option?: InputFocusOptions,
) {
  if (!element) return;

  element.focus(option);

  // Selection content
  const { cursor } = option || {};
  if (cursor) {
    const len = element.value.length;

    switch (cursor) {
      case 'start':
        element.setSelectionRange(0, 0);
        break;

      case 'end':
        element.setSelectionRange(len, len);
        break;

      default:
        element.setSelectionRange(0, len);
    }
  }
}

export function cloneChildren(children: Component, extraProps: Record<string, any>) {
  return createComponent(children, extraProps);
}
