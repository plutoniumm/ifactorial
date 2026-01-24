<script lang="ts">
  import { onMount } from "svelte";

  interface Data {
    name: string;
    html: string;
  }

  export let tabs: Data[] = [];

  onMount(() => {
    // INSANITY OF THE HIGHEST ORDER: FUCKING FAIL TILL YOU SUCCEED
    let interval = setInterval(() => {
      try {
        document.querySelector(".tabset > input[type='radio']").checked = true;
        clearInterval(interval);
      } catch (e) {}
    }, 100);
  });
</script>

<div class="tabset">
  {#each tabs as tab, idx}
    <input class="d-n" type="radio" name="tabset" id={"tab" + idx} />
    <label class="p-rel d-ib ptr p10 fw6" for={"tab" + idx}>{tab.name}</label>
  {/each}

  <div class="panels">
    {#each tabs as tab}
      <section class="panel d-n">
        {@html tab.html}
      </section>
    {/each}
  </div>
</div>

<style lang="scss">
  .tabset {
    margin: 20px 0;

    > input:first-child:checked ~ .panels > .panel:first-child,
    > input:nth-child(3):checked ~ .panels > .panel:nth-child(2),
    > input:nth-child(5):checked ~ .panels > .panel:nth-child(3),
    > input:nth-child(7):checked ~ .panels > .panel:nth-child(4),
    > input:nth-child(9):checked ~ .panels > .panel:nth-child(5),
    > input:nth-child(11):checked ~ .panels > .panel:nth-child(6) {
      display: block;
    }

    > label {
      min-width: 100px;
      border: 1px solid transparent;
      border-bottom: 0;

      border-top-left-radius: 3px;
      border-top-right-radius: 3px;
    }

    > input:checked + label {
      border-color: #8888;
      border-bottom: 1px solid #fff;
      margin-bottom: -1px;
    }

    .panel {
      border-top: 1px solid #8888;
    }

    max-width: 65em;
  }
</style>
