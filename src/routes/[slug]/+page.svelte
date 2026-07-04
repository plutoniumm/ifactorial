<script>
    import Book from "@components/book.svelte";
    import Key from "@components/key.svelte";
    import Fuse from "fuse.js";
    export let data;

    const options = {
        isCaseSensitive: false,
        shouldSort: false,
        minMatchCharLength: 3,
        useExtendedSearch: false,
        keys: ["author", "name", "description", "tags"],
    };
    const fuse = new Fuse(data.books, options);

    let search = "";

    const round = data.index;
</script>

<title>Round {round} | i!</title>
<meta name="title" content="Round {round}" />
<meta name="description" content={`List of readings in the year ${round}`} />

<a href="#top" class="rx5 m5 p-fix fw7"> &uarr; </a>
<div class="f-col">
    <div class="bar rx10 raise p10 m20 f-col g10">
        <input
            id="top"
            type="text"
            class="p10 rx10"
            bind:value={search}
            placeholder="Search by Book/Auth..."
        />

        <Key />
    </div>
</div>
<div class="section mx-a w-100 f fw j-ar">
    {#if !search.length}
        {#each data.books as book}
            <Book {book} />
        {/each}
    {:else}
        {#key search}
            {#each fuse.search(search) as result}
                <Book book={result.item} />
            {/each}
        {/key}
    {/if}
</div>

<style lang="scss">
    a {
        bottom: 1rem;
        right: 1rem;
        background: var(--theme);
        color: #fff;
        font-size: 2em;
        padding: 0 15px 7px 15px;
        z-index: 33;
    }

    input {
        width: calc(100% - 60px);
    }
</style>
