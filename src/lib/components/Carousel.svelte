<script>
	import { fade } from 'svelte/transition';

	export let images = [];
	export let alt = 'Product image';

	let currentIndex = 0;
	let touchStartX = 0;
	let touchEndX = 0;

	function next() {
		currentIndex = (currentIndex + 1) % images.length;
	}

	function prev() {
		currentIndex = (currentIndex - 1 + images.length) % images.length;
	}

	function goTo(index) {
		currentIndex = index;
	}

	function handleTouchStart(e) {
		touchStartX = e.changedTouches[0].screenX;
	}

	function handleTouchEnd(e) {
		touchEndX = e.changedTouches[0].screenX;
		handleSwipe();
	}

	function handleSwipe() {
		const threshold = 50;
		if (touchEndX < touchStartX - threshold) {
			next();
		}
		if (touchEndX > touchStartX + threshold) {
			prev();
		}
	}
</script>

<div
	class="relative w-full h-full group touch-pan-y"
	on:touchstart={handleTouchStart}
	on:touchend={handleTouchEnd}
>
	{#if images.length > 0}
		{#key currentIndex}
			<img
				src={images[currentIndex]}
				{alt}
				class="w-full h-full object-cover absolute inset-0 transition-transform duration-700 select-none"
				in:fade={{ duration: 300 }}
				draggable="false"
			/>
		{/key}

		{#if images.length > 1}
			<!-- Navigation Arrows -->
			<!-- Visible on hover for desktop, always visible on mobile/touch -->
			<button
				class="absolute left-2 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-md border border-white/20 text-white hover:bg-white/50 rounded-full p-3 transition-all shadow-lg z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 active:scale-95"
				on:click|stopPropagation={prev}
				aria-label="Previous image"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="2.5"
					stroke="currentColor"
					class="w-5 h-5 drop-shadow-md"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
				</svg>
			</button>

			<button
				class="absolute right-2 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-md border border-white/20 text-white hover:bg-white/50 rounded-full p-3 transition-all shadow-lg z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 active:scale-95"
				on:click|stopPropagation={next}
				aria-label="Next image"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="2.5"
					stroke="currentColor"
					class="w-5 h-5 drop-shadow-md"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
				</svg>
			</button>

			<!-- Dots -->
			<div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
				{#each images as _, i}
					<button
						class="transition-all shadow-sm backdrop-blur-sm {i === currentIndex
							? 'w-6 h-2 bg-white rounded-full'
							: 'w-2 h-2 bg-white/50 hover:bg-white/80 rounded-full'}"
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
