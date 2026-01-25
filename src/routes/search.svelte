<script>
  import { csvParse } from "d3-dsv";
  import Fuse from "fuse.js";

  const COLS = ["author", "name", "isbn", "year"];

  let query = "";
  let results = [];
  let index = [];
  let fuse;

  $: active = query.trim().length > 2 && results.length > 0;

  async function load() {
    if (fuse) return;
    const text = await fetch("/search.csv").then((r) => r.text());

    const cols = COLS.join(",") + "\n";
    index = csvParse(cols + text);
    fuse = new Fuse(index, {
      keys: COLS,
      threshold: 0.4,
      ignoreLocation: true,
      minMatchCharLength: 2,
    });
  }

  function update() {
    const q = query.trim();
    if (!fuse || q.length <= 2) {
      results = [];
      return;
    }

    results = (fuse?.search(q) || []).map((r) => r.item);
  }
</script>

<section class="search rx10 p5 m20 sw-100">
  <input
    type="text"
    class="p10 sw-100 d-b"
    placeholder="Search"
    id="global"
    bind:value={query}
    on:focus={load}
    on:input={update}
  />
  {#if active}
    <div class="wrap flow-y-s">
      <div class="grid d-g">
        <div class="head d-g al-ct p-stx fw7">
          <div>Year</div>
          <div>Title</div>
          <div>Author</div>
          <div>ISBN</div>
        </div>
        {#each results as r}
          <a class="row d-g al-ct" href="/{r.year}#{r.isbn}">
            <div>{r.year}</div>
            <div>{r.name}</div>
            <div><i>{r.author}</i></div>
            <div><kbd>{r.isbn}</kbd></div>
          </a>
        {/each}
      </div>
    </div>
  {/if}
</section>

<style lang="scss">
  .search {
    margin-bottom: 20px;

    box-shadow:
      5px 5px 10px var(--dark),
      -5px -5px 10px var(--light);
  }

  input[type="text"] {
    color: var(--text);
    transition: all 0.1s ease-in-out;
  }

  .wrap {
    max-height: 300px;
  }

  .grid {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .head,
  .row {
    grid-template-columns: 0.8fr 2fr 1.5fr 1.2fr;
  }

  .head {
    top: 0;
    z-index: 1;
    background-color: var(--bg, var(--light));
    padding: 0.6rem 0.8rem;
    border-bottom: 1px solid var(--dark);
  }

  .row {
    color: inherit;
    padding: 0.6rem 0.8rem;
    transition: background-color 0.1s ease-in-out;
  }

  .row:hover {
    background-color: var(--dark);
  }
</style>
