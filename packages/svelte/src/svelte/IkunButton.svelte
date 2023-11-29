
<script>
import { createEventDispatcher, onMount } from 'svelte';

let __ref;
let __mounted = false;

const dispatch = createEventDispatcher();

export let disabled = undefined;
export let type = undefined;
export let size = undefined;
export let danger = undefined;

export const handleFous = (...args) => __ref.handleFous(...args);

export const getWebComponent = () => __ref;

onMount(() => { __mounted = true; });

const setProp = (prop, value) => { if (__ref) __ref[prop] = value; };



const onEvent = (e) => {
  e.stopPropagation();
  dispatch(e.type, e.detail);
};
</script>

<ikun-button 
  disabled={disabled}
  type={type}
  size={size}
  danger={danger}
  on:ikunFocus={onEvent}
  on:ikunClick={onEvent}
  bind:this={__ref}
>
  <slot></slot>
</ikun-button>
  