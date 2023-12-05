
<script>
import { createEventDispatcher, onMount } from 'svelte';

let __ref;
let __mounted = false;

const dispatch = createEventDispatcher();

export let type;
export let size = undefined;
export let loading;
export let disabled;
export let ghost;
export let block;
export let danger;
export let shape;
export let prefixCls;
export let htmlType;
export let icon;
export let target;
export let href;
export let beeTitle;



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
  