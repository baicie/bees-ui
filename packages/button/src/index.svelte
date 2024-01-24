<svelte:options
  customElement={{
    tag: "svelte-buton",
    props: {
      type: { reflect: false, type: "String", attribute: "bee-button-type" },
    },
    // no means no shadow dom
    slot: {
      name: "default",
      no: true,
    },
  }}
/>

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

  const dispatch = createEventDispatcher();
  const handleClick = (e: Event) => {
    dispatch("click", e);
  };

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

<svelte:element this={"button"} class="primary" on:click={handleClick} use:foo>
  name is {type}
  <slot />
</svelte:element>

<style>
  .primary {
    background-color: #ff0000;
  }
</style>
