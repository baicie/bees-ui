<script lang="ts" context="module">
  import { createEventDispatcher } from "svelte";
  import type { Action } from "svelte/action";
  import type { ButtonProps } from "./Button";

  export let loading: ButtonProps["loading"] = false,
    prefixCls: ButtonProps["prefixCls"] = "bee-button",
    type: ButtonProps["type"] = "default",
    shape: ButtonProps["shape"] = "default",
    size: ButtonProps["size"],
    // styles: ButtonProps['styles'],
    disabled: ButtonProps["disabled"],
    className: ButtonProps["className"],
    rootClassName: ButtonProps["rootClassName"],
    ghost: ButtonProps["ghost"],
    block: ButtonProps["block"],
    htmlType: ButtonProps["htmlType"] = "button",
    classNames: ButtonProps["classNames"],
    style: ButtonProps["style"];

  const foo: Action = (node) => {
    console.log("foo", node);
    return {
      destroy() {
        console.log("destroy foo");
      },
      update(parameter) {
        console.log("update foo", parameter);
      },
    };
  };
</script>

<svelte />

<svelte:element this={"button"} class="primary">
  <slot name="pre"></slot>
  name is {type}
  <slot></slot>
</svelte:element>
