<script>
	import bibiCrias from '$lib/assets/bibi_crias.jpeg';
	import { fade, fly } from 'svelte/transition';
	// About Section
</script>

<section class="py-24 px-6 bg-[var(--color-navy-blue)] text-[var(--color-cream)] relative">
	<div class="container mx-auto flex flex-col md:flex-row items-center gap-12">
		<!-- Image Column -->
		<div class="w-full md:w-1/2" in:fly={{ x: -50, duration: 1000, delay: 200 }}>
			<div class="relative transform rotate-2 hover:rotate-0 transition duration-500">
				<div
					class="absolute inset-0 border-2 border-[var(--color-sunset-orange)] rounded-lg transform translate-x-4 translate-y-4"
				></div>
				<img
					src={bibiCrias}
					alt="Ábi com crianças"
					class="relative rounded-lg shadow-2xl w-full object-cover aspect-[3/4]"
				/>
			</div>
		</div>

		<!-- Text Column -->
		<div class="w-full md:w-1/2 space-y-6" in:fly={{ x: 50, duration: 1000, delay: 400 }}>
			<h2 class="font-display text-5xl text-[var(--color-sunset-orange)]">Sobre o Bazar</h2>
			<p class="font-body text-lg leading-relaxed opacity-90">
				Todo o valor arrecadado neste bazar tem um propósito maior: apoiar missões e levar amor a
				quem precisa. Ao levar uma peça, você também está fazendo parte dessa jornada.
			</p>
		</div>
	</div>

	<!-- Minimalist Tulip Divider -->
	<div class="absolute bottom-0 left-0 w-full flex justify-center translate-y-1/2 z-10">
		<div
			class="bg-[var(--color-deep-forest)] p-4 rounded-full border-4 border-[var(--color-navy-blue)]"
		>
			<svg
				width="40"
				height="40"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="text-[var(--color-cream)]"
			>
				<!-- Stem -->
				<path d="M12 22V12" />
				<!-- Leaves -->
				<path d="M12 22C9 18 8 16 8 12" />
				<path d="M12 22C15 18 16 16 16 12" />
				<!-- Flower Cup -->
				<path d="M12 12C9 12 7 9 7 6C7 4 8 2 12 2C16 2 17 4 17 6C17 9 15 12 12 12Z" />
				<!-- Petal details -->
				<path d="M12 2V12" />
			</svg>
		</div>
	</div>
</section>
