<script>
	import sorrisao from '$lib/assets/sorrisao.jpeg';
	// Hero Section
</script>

<section
	class="relative h-screen w-full overflow-hidden bg-[var(--color-deep-forest)] text-[var(--color-cream)]"
>
	<!-- Background Image Placeholder -->
	<div
		class="absolute inset-0 opacity-40 bg-gradient-to-b from-black/30 to-[var(--color-deep-forest)]"
	>
		<div class="w-full h-full bg-cover bg-center" style="background-image: url({sorrisao});"></div>
	</div>

	<div class="relative z-10 flex h-full flex-col items-center justify-end pb-32 px-6 text-center">
		<h1
			class="font-display mb-4 text-6xl md:text-8xl drop-shadow-lg animate-[float_6s_ease-in-out_infinite]"
		>
			Bazar da Abi
		</h1>
		<p class="font-body mb-8 text-xl md:text-2xl font-light tracking-wide max-w-2xl">
			Do meu armário para novas histórias. Desapegos com propósito.
		</p>

		<a
			href="#vitrine"
			class="bg-[var(--color-sunset-orange)] hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition hover:scale-105 hover:shadow-xl text-lg inline-block"
		>
			Ver Peças
		</a>
	</div>

	<!-- Decorative Fern/Leaf overlay (Optional) -->
	<div
		class="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[var(--color-deep-forest)] to-transparent"
	></div>
</section>
