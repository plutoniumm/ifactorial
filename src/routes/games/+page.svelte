<script lang="ts">
  import Card from "@components/card.svelte";
  import Malevich from "@components/malevich.svelte";

  let games: string[][] = [
    ["/games/pipes", "Pipes"],
    ["/games/2048", "2048"],
    ["/games/tetris", "Tetris"],
  ];
</script>

<section>
  <div class="mx-a" style="font-size: 24px;max-width: min(600px, 90vw);">
    Now that you've gone out of your way to find games on a page about books,
    might as well play some.
  </div>
  <br />

  <section class="f fw j-ar">
    {#each games as [url, name]}
      <Card {url} {name}>
        <Malevich seed={name} height={150} width={300} />
      </Card>
    {/each}
  </section>
</section>

<style>
</style>
