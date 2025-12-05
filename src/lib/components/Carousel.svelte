<script>
	import { fade } from 'svelte/transition';

	export let images = [];
	export let alt = 'Product image';

	let currentIndex = 0;

	function next() {
		currentIndex = (currentIndex + 1) % images.length;
	}

	function prev() {
		currentIndex = (currentIndex - 1 + images.length) % images.length;
	}

	function goTo(index) {
		currentIndex = index;
	}
</script>

<div class="relative w-full h-full group">
	{#if images.length > 0}
		{#key currentIndex}
			<img
				src={images[currentIndex]}
				{alt}
				class="w-full h-full object-cover absolute inset-0 transition-transform duration-700"
				in:fade={{ duration: 300 }}
			/>
		{/key}

		{#if images.length > 1}
			<!-- Navigation Arrows -->
			<button
				class="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[var(--color-deep-forest)] rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-10"
				on:click|stopPropagation={prev}
				aria-label="Previous image"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="2.5"
					stroke="currentColor"
					class="w-4 h-4"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
				</svg>
			</button>

			<button
				class="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[var(--color-deep-forest)] rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-10"
				on:click|stopPropagation={next}
				aria-label="Next image"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="2.5"
					stroke="currentColor"
					class="w-4 h-4"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
				</svg>
			</button>

			<!-- Dots -->
			<div class="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
				{#each images as _, i}
					<button
						class="w-2 h-2 rounded-full transition-all shadow-sm {i === currentIndex
							? 'bg-white scale-110'
							: 'bg-white/50 hover:bg-white/80'}"
						on:click|stopPropagation={() => goTo(i)}
						aria-label="Go to image {i + 1}"
					/>
				{/each}
			</div>
		{/if}
	{:else}
		<div class="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
			<span class="text-xs">Sem imagem</span>
		</div>
	{/if}
</div>
