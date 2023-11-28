
<script>
import { createEventDispatcher, onMount } from 'svelte';

let __ref;
let __mounted = false;

const dispatch = createEventDispatcher();

export let first = undefined;
export let middle = undefined;
export let last = undefined;



export const getWebComponent = () => __ref;

onMount(() => { __mounted = true; });

const setProp = (prop, value) => { if (__ref) __ref[prop] = value; };



const onEvent = (e) => {
  e.stopPropagation();
  dispatch(e.type, e.detail);
};
</script>

<my-component 
  first={first}
  middle={middle}
  last={last}
  
  bind:this={__ref}
>
  <slot></slot>
</my-component>
  