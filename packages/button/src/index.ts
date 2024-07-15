/// <reference types="./type" />
import Button from "./index.svelte";
import svelteRetag from "svelte-retag";
export { Button as KButton };
svelteRetag({
  component: Button,
  tagname: "hello-world",
  attributes: true,
  shadow: false,
});
