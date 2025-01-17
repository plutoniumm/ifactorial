<nav class="fade-down">
	<section class="f j-ct mx-a">
		<div class="f fw4 p5" style="font-size:1.5em;color:#444;">
			<a href="#">
				<img height="24px" class="p-rel" src="/icons/if.svg" alt="Logo" />
				Plutoniumm's Readings
			</a>
		</div>
	</section>
	<hr class="w-33 o-33" />
</nav>

<main class="">
	<slot />
</main>

<!-- KEEP IT SIMPLE NO FOOTER -->
<style>
	a img {
		top: 4px;
		aspect-ratio: 1;
	}
	section {
		max-width: calc(1040px + 40px);
	}
	nav {
		align-items: center;
		width: calc(100% - 2rem);
		padding: 0.5rem 1rem;
	}
	main {
		max-width: 1040px;
		margin: 2rem auto;
	}
</style>
