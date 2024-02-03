<script lang="ts">
  export let onClick: () => void;
</script>

<button on:click={onClick} class="rounded-full bg-white/5 w-14 h-14 text-xl flex justify-center items-center {$$restProps.class || ''}">
  <slot />
</button>