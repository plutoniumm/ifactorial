<script lang="ts">
  let games: string[][] = [
    // url, name
    ["/games/flow", "Numberlink"],
  ];
</script>

<section>
  <div>
    Now that you've gone out of your way to find games on a website dedicated to
    books, might as well play some.
  </div>

  <ul>
    {#each games as [url, name]}
      <li><a href={url}>{name}</a></li>
    {/each}
  </ul>
</section>

<style>
</style>
