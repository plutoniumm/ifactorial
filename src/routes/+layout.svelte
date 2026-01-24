<nav class="fade-down al-ct p20 sw-100">
	<section class="f j-ct mx-a">
		<div class="f fw4 p5" style="font-size:1.5em;color:#444;">
			<a href="/">
				<img height="24px" class="p-rel" src="/icons/if.svg" alt="Logo" />
				Plutoniumm's Readings
			</a>
		</div>
	</section>
	<hr class="w-33 o-33" />
</nav>

<main><slot /></main>

<footer class="tc p5 sw-100" style="margin-top: 10vh;">
	<ul class="f p0 m0 g20 j-ct">
		<li class="p5"><a href="/api">API</a></li>
		<li class="p5"><a href="/games">Games</a></li>
	</ul>
</footer>

<style lang="scss">
	footer {
		background: #eef8;
		color: #666;
		bottom: 0;
	}

	ul {
		list-style: none;

		li:hover {
			text-decoration: underline;
		}
	}

	a img {
		top: 4px;
		aspect-ratio: 1;
	}

	section {
		max-width: calc(1040px + 40px);
	}

	main {
		max-width: 1040px;
		min-height: 75vh;
		margin: 2rem auto;
	}
</style>
