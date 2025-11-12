<script>
	import Mondrian from "../components/Mondrian.svelte";
	export let data = [];

	const files = data.files.map((e) => e.replace(".csv", ""));
</script>

<section class="f fw j-ar">
	{#each files as round, index}
		<a class="rpm-10 d-b p-rel ptr f-col rx20" href={round}>
			<Mondrian seed={index} height={150} width={300} />
			<div class="p-abs f-col j-ct fw7 year">
				{round}
			</div>
		</a>
	{/each}
</section>

<style lang="scss">
	:global(:root) {
		--color-text-muted: #888;
		--color-surface: #eee;
		--elevated-D: #ccc;
		--elevated-L: #fff;
		--hover-D: #ddd;
		--hover-L: #eee;
		--inset-D: rgba(197, 197, 197, 0.55);
		--inset-L: rgba(255, 255, 255, 0.65);
	}

	a {
		width: 300px;
		height: 150px;
		background: var(--color-surface);
		transition: all 0.2s ease-in-out;

		filter: saturate(1);
		box-shadow:
			6px 6px 12px var(--elevated-D),
			-6px -6px 12px var(--elevated-L);
	}

	a:hover {
		filter: saturate(0.8);
		box-shadow:
			4px 4px 10px var(--hover-D),
			-4px -4px 10px var(--hover-L),
			inset 2px 2px 6px var(--inset-D),
			inset -2px -2px 6px var(--inset-L);
	}

	a:focus,
	a:active {
		box-shadow:
			0px 0px 0px var(--elevated-D),
			0px 0px 0px var(--elevated-L),
			inset 4px 4px 12px var(--elevated-D),
			inset -4px -4px 12px var(--elevated-L);
	}

	.year {
		color: #222;
		font-size: 3rem;
		bottom: 7px;
		left: 17px;

		text-shadow:
			0 0 20px #888a,
			0 0 30px #888;
	}
</style>
