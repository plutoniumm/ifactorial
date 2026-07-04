<script>
	import Mondrian from "@components/mondrian.svelte";
	import Card from "@components/card.svelte";
	import Search from "./search.svelte";

	export let data = [];

	const files = data.files.map((e) => e.replace(".csv", ""));
	const latest = files[files.length - 1];
</script>

<Search></Search>

<section class="f fw j-ar">
	{#each files as round}
		<Card url="/{round}" name={round} dim={round === latest}>
			<Mondrian seed={round - 2021} height={150} width={300} />
		</Card>
	{/each}
</section>

<style lang="scss">
</style>
