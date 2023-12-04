
<script>
import { createEventDispatcher, onMount } from 'svelte';

let __ref;
let __mounted = false;

const dispatch = createEventDispatcher();

export let componentSize = undefined;
export let theme;
export let locale;



export const getWebComponent = () => __ref;

onMount(() => { __mounted = true; });

const setProp = (prop, value) => { if (__ref) __ref[prop] = value; };

$: if (__mounted) setProp('theme', theme);
$: if (__mounted) setProp('locale', locale);

const onEvent = (e) => {
  e.stopPropagation();
  dispatch(e.type, e.detail);
};
</script>

<bees-config-provider 
  component-size={componentSize}
  
  bind:this={__ref}
>
  <slot></slot>
</bees-config-provider>
  