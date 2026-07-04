<script>
  import Tabs from "./tabs.svelte";
  import "./code.css";

  export let data;
  const { _interface, tabs } = data;
</script>

<main class="p20">
  Even after Demerzel has achieved Galaxia at the end of time, I don't think I
  will be able to find out why I caved to those who asked for an API. Each page
  contains the keys:

  {@html _interface}

  <Tabs {tabs}></Tabs>
</main>

<style lang="scss">
  main {
    line-height: 1.5;
  }
</style>
