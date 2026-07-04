<script>
  export let value = false;
  export let label = "";
</script>

<label class="d-ib f g10 al-ct ptr">
  <div class="toggle p-rel rx20">
    <input class="state d-n" type="checkbox" bind:checked={value} />
    <div class="indicator h-100 rx20"></div>
  </div>

  {#if label}
    <div>{label}</div>
  {/if}
</label>

<style>
  .toggle {
    isolation: isolate;
    height: 30px;
    width: 60px;
    overflow: hidden;

    box-shadow:
      -10px -5px 10px var(--light),
      10px 5px 12px var(--dark),
      inset 5px 5px 5px var(--dark),
      inset -5px -5px 5px var(--light);
  }

  .indicator {
    width: 200%;
    background: #eee;

    transform: translate3d(-75%, 0, 0);
    transition: transform 0.4s ease-in-out;
    box-shadow:
      -10px -5px 10px var(--light),
      10px 5px 12px var(--dark);
  }

  .state:checked ~ .indicator {
    transform: translate3d(25%, 0, 0);
    background: var(--theme);
  }
</style>
