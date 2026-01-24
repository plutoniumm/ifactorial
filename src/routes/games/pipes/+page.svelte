<script>
  import Meta from "@components/meta.svelte";
  import { make, link } from "./index";
  import { onMount } from "svelte";
  import { hsl } from "./utils";

  let scale = 12;
  let grid = [];
  let sets = [];
  let drag = false;
  let pick = null;
  let win = false;

  let WALL = 600;

  $: scale = 12;

  function build() {
    win = false;
    let res = make(scale);
    grid = res.grid;
    sets = res.sets;
  }
  $: build();

  function down(node) {
    if (win) return;
    if (node.tint === 0) return;
    pick = node;

    drag = true;
  }

  function enter(node) {
    if (!drag || !pick) return;
    if (win) return;

    let diff = Math.abs(node.x - pick.x) + Math.abs(node.y - pick.y);

    if (diff === 1) {
      link(node, pick);
      pick = node;
      grid = grid;
      check();
    }
  }

  function up() {
    drag = false;
    pick = null;
  }

  function dbl(node) {
    if (node) {
      node.nuke();
      grid = grid;
      check();
    }
  }

  function check() {
    let w = true;
    let void_nodes = grid.filter((n) => n.arcs.length === 0);
    if (void_nodes.length > 0) w = false;

    for (let s of sets) {
      if (s[0].id !== s[1].id) w = false;
    }
    win = w;
  }

  function tied(node, dx, dy) {
    return node.arcs.some(
      (n) =>
        n.x === node.x + dx && //
        n.y === node.y + dy,
    );
  }

  onMount(() => {
    let params = new URLSearchParams(window.location.search);
    let s = Number(params.get("scale") ?? 12);
    if (s >= 5 && s <= 15) scale = s;

    build();
    window.addEventListener("mouseup", up);

    return () => window.removeEventListener("mouseup", up);
  });
</script>

<Meta description="Flow based on numberlink" name="Flow Game" />

<div class="box h-100 w-100 f-col j-ct p0">
  {#if win}
    <div class="f j-ct al-ct p10 fw7" style="font-size: 4em;">You win!</div>
  {/if}

  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="grid p0 mx-a"
    style="--dim:{scale};--wall: {WALL}px;"
    on:mouseleave={up}
  >
    {#each grid as node (node.key)}
      {@const col = hsl(node.tint)}

      <div
        class="tile f al-ct j-ct ptr p-rel rx50"
        class:end={node.val > 0}
        class:pressed={node.tint}
        on:mousedown={() => down(node)}
        on:mouseenter={() => enter(node)}
        on:dblclick={() => dbl(node)}
      >
        {#if node.tint}
          <div class="pipe" style="background: {col};"></div>
          {#if tied(node, 0, -1)}
            <div class="pipe n" style="background: {col};"></div>
          {/if}
          {#if tied(node, 0, 1)}
            <div class="pipe s" style="background: {col};"></div>
          {/if}
          {#if tied(node, -1, 0)}
            <div class="pipe w" style="background: {col};"></div>
          {/if}
          {#if tied(node, 1, 0)}
            <div class="pipe e" style="background: {col};"></div>
          {/if}
        {/if}

        {#if node.val > 0}
          <div class="dot f al-ct j-ct fw7" style="color: {hsl(node.tint)};">
            {node.val}
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>

<style>
  .box {
    user-select: none;
    align-items: stretch;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(var(--dim), 1fr);
    grid-template-rows: repeat(var(--dim), 1fr);
    width: var(--wall);
    height: var(--wall);
    background: transparent;
    border-left: 2px solid #ddd;
    touch-action: none;
    box-sizing: border-box;
    gap: 0.35vmin;
  }

  .tile {
    position: relative;
    background: var(--color-surface);
    transition:
      box-shadow 120ms ease,
      transform 120ms ease,
      filter 120ms ease;
    filter: saturate(1);
    box-shadow:
      6px 6px 12px var(--elevated-D),
      -6px -6px 12px var(--elevated-L);
  }

  .tile:hover {
    filter: saturate(0.8);
    box-shadow:
      4px 4px 10px var(--hover-D),
      -4px -4px 10px var(--hover-L),
      inset 2px 2px 6px var(--inset-D),
      inset -2px -2px 6px var(--inset-L);
  }

  .tile.pressed {
    box-shadow:
      inset 4px 4px 12px var(--elevated-D),
      inset -4px -4px 12px var(--elevated-L);
  }

  .pipe {
    position: absolute;
    z-index: 1;
    border-radius: 6px;
  }

  .pipe.n {
    top: 0;
    left: 35%;
    width: 30%;
    height: 50%;
  }
  .pipe.s {
    bottom: 0;
    left: 35%;
    width: 30%;
    height: 50%;
  }
  .pipe.w {
    left: 0;
    top: 35%;
    width: 50%;
    height: 30%;
  }
  .pipe.e {
    right: 0;
    top: 35%;
    width: 50%;
    height: 30%;
  }

  .dot {
    z-index: 2;
    width: 70%;
    height: 70%;
    font: 28px Arial Black;
    opacity: 0.66;
  }

  .rx50 {
    border-radius: 50px;
    overflow: hidden;
  }
</style>
