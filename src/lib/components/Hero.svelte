<script>
	import { fade, fly } from 'svelte/transition';
	// Hero Section
</script>

<section
	class="relative h-screen w-full overflow-hidden bg-[var(--color-deep-forest)] text-[var(--color-cream)]"
>
	<!-- Abstract Elegant Background -->
	<div class="absolute inset-0 opacity-20">
		<div
			class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_var(--color-sunset-orange)_0%,_transparent_50%)] blur-[100px] transform scale-150 animate-pulse-slow"
		></div>
		<div
			class="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,_#ffffff_0%,_transparent_30%)] blur-[80px] opacity-30"
		></div>
	</div>

	<!-- Texture Overlay -->
	<div
		class="absolute inset-0 opacity-10"
		style="background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"
	></div>

	<div
		class="relative z-10 flex h-full flex-col items-center justify-center pb-20 px-6 text-center"
	>
		<h1
			class="font-display mb-6 text-6xl md:text-8xl drop-shadow-2xl animate-[float_6s_ease-in-out_infinite]"
			in:fly={{ y: 50, duration: 1000, delay: 300 }}
		>
			Bazar da Ábi
		</h1>
		<p
			class="font-body mb-10 text-xl md:text-2xl font-light tracking-wide max-w-2xl opacity-90"
			in:fly={{ y: 30, duration: 1000, delay: 600 }}
		>
			Do meu armário para novas histórias. <br /> Desapegos com propósito.
		</p>

		<a
			href="#vitrine"
			class="bg-[var(--color-sunset-orange)] hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-full shadow-lg transform transition hover:scale-105 hover:shadow-2xl text-lg inline-block border-2 border-transparent hover:border-white/20"
			in:fly={{ y: 20, duration: 1000, delay: 900 }}
		>
			Ver Peças
		</a>
	</div>

	<!-- Decorative Bottom Fade -->
	<div
		class="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[var(--color-deep-forest)] to-transparent"
	></div>
</section>

<style>
	.animate-pulse-slow {
		animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}
	@keyframes pulse {
		0%,
		100% {
			opacity: 0.5;
		}
		50% {
			opacity: 0.8;
		}
	}
</style>
