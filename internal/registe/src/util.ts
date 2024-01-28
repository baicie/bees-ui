/**
 * Functions are placed here for better encapsulation and readability of the main codebase. This helps to isolate them
 * from the DOM API of the implemented web component (particularly if they are static and do not need access to instance
 * level information, i.e. they do not call "this").
 */

/**
 * Extracted from svelte's internal API @ src/runtime/internal/dom.js
 *
 * @param {Node} target
 * @param {Node} node
 * @param {Node} [anchor]
 * @returns {void}
 */
function insert(target: Node, node: Node, anchor: Node): void {
  target.insertBefore(node, anchor || null);
}

/**
 * Extracted from svelte's internal API @ src/runtime/internal/dom.js
 *
 * @param {Node} node
 * @returns {void}
 */
function detach(node: Node): void {
  if (node.parentNode) {
    node.parentNode.removeChild(node);
  }
}

/**
 * Creates an object where each property represents the slot name and each value represents a Svelte-specific slot
 * object containing the lifecycle hooks for each slot. This wraps our slot elements and is passed to Svelte itself.
 *
 * Much of this witchcraft is from svelte issue - https://github.com/sveltejs/svelte/issues/2588
 */
export function createSvelteSlots(slots: any) {
  const svelteSlots = {};

  function createSlotFn(element: any) {
    return function () {
      return {
        c: function () {}, // noop
        m: function mount(target, anchor) {
          insert(target, element.cloneNode(true), anchor);
        },
        d: function destroy(detaching) {
          if (detaching) {
            detach(element);
          }
        },
        l: function () {}, // noop
      };
    };
  }

  for (const slotName in slots) {
    svelteSlots[slotName] = [createSlotFn(slots[slotName])];
  }

  return svelteSlots;
}

/**
 * Traverses DOM to find the first custom element that the provided <slot> element happens to belong to.
 *
 * @param {Element} slot
 * @returns {HTMLElement|null}
 */
export function findSlotParent(slot: Element): HTMLElement | null {
  let parentEl = slot.parentElement;
  while (parentEl) {
    if (parentEl.tagName.indexOf('-') !== -1) return parentEl;
    parentEl = parentEl.parentElement;
  }
  return null;
}

/**
 * Carefully "unwraps" the custom element tag itself from its default slot content (particularly if that content
 * is just a text node). Only used when not using shadow root.
 *
 * @param {HTMLElement} from
 *
 * @returns {DocumentFragment}
 */
export function unwrap(from: HTMLElement): DocumentFragment {
  let node = document.createDocumentFragment();
  while (from.firstChild) {
    node.appendChild(from.firstChild);
  }
  return node;
}
