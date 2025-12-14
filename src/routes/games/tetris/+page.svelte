<script>
  import { onMount } from "svelte";
  import { Tetris } from ".";

  let root, scoreNode, game;

  onMount(() => {
    game = new Tetris(root, scoreNode);

    return () => game.kill();
  });
</script>

<div class="f-col al-ct j-ct">
  <div class="stat" style="margin-bottom: 20px;">
    Score: <span bind:this={scoreNode}>0</span>
  </div>

  <div class="stage rx10 p5" bind:this={root}></div>
</div>

<style>
  .stat {
    font-variant-numeric: tabular-nums;
    color: #666;
    font-weight: 500;
  }

  .stage {
    width: 330px;
    height: 660px;
    background: var(--color-surface);
    box-shadow:
      6px 6px 12px var(--elevated-D),
      -6px -6px 12px var(--elevated-L);
  }
</style>
