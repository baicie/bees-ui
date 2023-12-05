
<script>
import { createEventDispatcher, onMount } from 'svelte';

let __ref;
let __mounted = false;

const dispatch = createEventDispatcher();

export let type = undefined;
export let size = undefined;
export let loading = undefined;
export let disabled = undefined;
export let ghost = undefined;
export let block = undefined;
export let danger = undefined;
export let shape = undefined;
export let prefixCls = undefined;
export let htmlType = undefined;
export let icon = undefined;
export let target = undefined;
export let href = undefined;
export let beeTitle = undefined;



export const getWebComponent = () => __ref;

onMount(() => { __mounted = true; });

const setProp = (prop, value) => { if (__ref) __ref[prop] = value; };



const onEvent = (e) => {
  e.stopPropagation();
  dispatch(e.type, e.detail);
};
</script>

<bees-button 
  type={type}
  size={size}
  loading={loading}
  disabled={disabled}
  ghost={ghost}
  block={block}
  danger={danger}
  shape={shape}
  prefix-cls={prefixCls}
  html-type={htmlType}
  icon={icon}
  target={target}
  href={href}
  bee-title={beeTitle}
  on:beeClick={onEvent}
  on:beeMousedown={onEvent}
  bind:this={__ref}
>
  <slot></slot>
</bees-button>
  