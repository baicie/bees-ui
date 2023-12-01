/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
import { Components, JSX } from '@bees-ui/core';


interface IkunWaveProps {
  
  /**  */
  disabled?: Components.IkunWave["disabled"]
}

interface IkunWaveEvents {
  
}

interface IkunWaveSlots {
  default: any
}
  
/* generated by Svelte v4.2.7 */
import {
	SvelteComponent,
	binding_callbacks,
	create_slot,
	detach,
	element,
	get_all_dirty_from_scope,
	get_slot_changes,
	init,
	insert,
	safe_not_equal,
	set_custom_element_data,
	transition_in,
	transition_out,
	update_slot_base
} from "svelte/internal";

import "svelte/internal/disclose-version";
import { createEventDispatcher, onMount } from 'svelte';

function create_fragment(ctx) {
	let ikun_wave;
	let current;
	const default_slot_template = /*#slots*/ ctx[4].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

	return {
		c() {
			ikun_wave = element("ikun-wave");
			if (default_slot) default_slot.c();
			set_custom_element_data(ikun_wave, "disabled", /*disabled*/ ctx[0]);
		},
		m(target, anchor) {
			insert(target, ikun_wave, anchor);

			if (default_slot) {
				default_slot.m(ikun_wave, null);
			}

			/*ikun_wave_binding*/ ctx[5](ikun_wave);
			current = true;
		},
		p(ctx, [dirty]) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[3],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
						null
					);
				}
			}

			if (!current || dirty & /*disabled*/ 1) {
				set_custom_element_data(ikun_wave, "disabled", /*disabled*/ ctx[0]);
			}
		},
		i(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				detach(ikun_wave);
			}

			if (default_slot) default_slot.d(detaching);
			/*ikun_wave_binding*/ ctx[5](null);
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	let __ref;
	let __mounted = false;
	const dispatch = createEventDispatcher();
	let { disabled = undefined } = $$props;
	const getWebComponent = () => __ref;

	onMount(() => {
		__mounted = true;
	});

	const setProp = (prop, value) => {
		if (__ref) $$invalidate(1, __ref[prop] = value, __ref);
	};

	const onEvent = e => {
		e.stopPropagation();
		dispatch(e.type, e.detail);
	};

	function ikun_wave_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			__ref = $$value;
			$$invalidate(1, __ref);
		});
	}

	$$self.$$set = $$props => {
		if ('disabled' in $$props) $$invalidate(0, disabled = $$props.disabled);
		if ('$$scope' in $$props) $$invalidate(3, $$scope = $$props.$$scope);
	};

	return [disabled, __ref, getWebComponent, $$scope, slots, ikun_wave_binding];
}

class IkunWave extends SvelteComponent {
  $$prop_def: IkunWaveProps;
  $$events_def: IkunWaveEvents;
  $$slot_def: IkunWaveSlots;

  $on<K extends keyof IkunWaveEvents>(type: K, callback: (e: IkunWaveEvents[K]) => any): () => void {
	  return super.$on(type, callback);
	}

  $set($$props: Partial<IkunWaveProps>): void {
	  super.$set($$props);
	}

	constructor(options) {
		super();
		init(this, options, instance, create_fragment, safe_not_equal, { disabled: 0, getWebComponent: 2 });
	}

	get getWebComponent(): HTMLIkunWaveElement | undefined {
		return this.$$.ctx[2];
	}
}

export default IkunWave;