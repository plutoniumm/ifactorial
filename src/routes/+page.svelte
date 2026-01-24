<script>
	import Mondrian from "@components/Mondrian.svelte";
	import Card from "@components/card.svelte";
	export let data = [];

	const files = data.files.map((e) => e.replace(".csv", ""));
</script>

<section class="f fw j-ar">
	{#each files as round}
		<Card url="/{round}" name={round}>
			<Mondrian seed={round - 2021} height={150} width={300} />
		</Card>
	{/each}
</section>

<style lang="scss">
</style>
