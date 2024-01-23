<svelte:options customElement={{
  tag: 'svelte-buton',
  shadow: 'none',
  props: {
    name: { reflect: true, type: 'Number', attribute: 'element-index' }
  },
  extend: (customElementConstructor) => {
    // Extend the class so we can let it participate in HTML forms
    return class extends customElementConstructor {
      static formAssociated = true;

      constructor() {
        super();
        this.attachedInternals = this.attachInternals();
      }

      // Add the function here, not below in the component so that
      // it's always available, not just when the inner Svelte component
      // is mounted
      randomIndex() {
        this.elementIndex = Math.random();
      }
    };
  }
}}></svelte:options>

<script lang="ts" >

</script>

<svelte:element this={'button'}>
  <slot></slot>
</svelte:element>
