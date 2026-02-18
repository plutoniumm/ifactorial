<script>
    import Book from "@components/book.svelte";
    import { onMount } from "svelte";
    import Fuse from "fuse.js";
    import Toggle from "./toggle.svelte";
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
    let lender;

    let given = [];
    $: external = false;
    $: lent = false;

    const FADE = " { opacity: 0.5 !important; }";
    $: {
        if (lender)
            lender.textContent = lent
                ? given.map((e) => `.book[data-key="${e}"]`).join(",\n") + FADE
                : "";
    }

    const round = data.index;

    onMount(() => {
        given = window.mod.given
            .filter((e) => e.key.startsWith(`${round}-`))
            .map((e) => Number(e.key.split("-")[1]) - 1);
    });
</script>

<title>Round {round} | i!</title>
<meta name="title" content="Round {round}" />
<meta name="description" content={`List of readings in the year ${round}`} />

<a href="#top" class="rx5 m5 p-fix fw7"> &uarr; </a>
<div class="f-col">
    <input
        id="top"
        type="text"
        class="p10 m20 rx10 raise"
        bind:value={search}
        placeholder="Search by Book/Auth..."
    />

    <div class="f j-ar" style="margin-bottom: 20px;">
        <Toggle bind:value={external} label="Show Links" />
        <Toggle bind:value={lent} label="Fade Lent" />

        {#if external}
            <style>
                .external {
                    display: block !important;
                }
            </style>
        {/if}

        {#if lent}
            <style bind:this={lender}></style>
        {/if}
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
