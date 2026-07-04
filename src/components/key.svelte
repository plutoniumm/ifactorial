<script>
  import { onMount } from "svelte";
  import Toggle from "./toggle.svelte";

  let entries = [];
  let external = false;

  onMount(async () => {
    const data = await fetch("/keys.json").then((r) => r.json());
    entries = Object.values(data).flat();
  });
</script>

<div class="key f al-ct fw">
  <Toggle bind:value={external} label="Show Links" />

  {#if entries.length}
    <div class="legend f al-ct g20 fw">
      {#each entries as e}
        <div class="chip f al-ct g5">
          {#if e.icon.startsWith("/")}
            <img class="icon tc" src={e.icon} alt={e.label} />
          {:else}
            <span class="icon tc" style="color:{e.color}">{e.icon}</span>
          {/if}
          <span class="label">{e.label}</span>
        </div>
      {/each}
    </div>
  {/if}
</div>

{#if external}
  <style>
    .external {
      display: block !important;
    }
  </style>
{/if}

<style lang="scss">
  .key {
    justify-content: space-between;
    border-top: 1px solid var(--dark);
    padding-top: 10px;
  }

  .legend {
    padding-left: 20px;
    border-left: 1px solid var(--dark);
  }

  .label {
    font-size: 0.85em;
    color: var(--text);
    opacity: 0.65;
  }

  .icon {
    font-size: 1.6em;
    min-width: 1em;
  }

  img.icon {
    width: 1em;
    height: 1em;
    min-width: 0;
  }

  @media (max-width: 600px) {
    .legend {
      border-left: none;
      padding-left: 0;
    }
  }
</style>
