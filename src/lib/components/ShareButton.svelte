<script>
	import { fade, fly, scale } from 'svelte/transition';
	import { onMount } from 'svelte';

	let isVisible = false;
	let isCopied = false;

	onMount(() => {
		// Show button after a small delay or scroll
		setTimeout(() => {
			isVisible = true;
		}, 1000);
	});

	async function share() {
		if (isCopied) return;

		const shareData = {
			title: 'Bazar da Ábi | Desapegos com Propósito',
			text: 'Do meu armário para novas histórias. Desapegos com propósito.',
			url: window.location.href
		};

		if (navigator.share) {
			try {
				await navigator.share(shareData);
			} catch (err) {
				console.log('Error sharing:', err);
			}
		} else {
			// Fallback: Copy to clipboard with animation
			try {
				await navigator.clipboard.writeText(window.location.href);
				isCopied = true;
				setTimeout(() => {
					isCopied = false;
				}, 2500);
			} catch (err) {
				console.error('Failed to copy:', err);
			}
		}
	}
</script>

{#if isVisible}
	<button
		on:click={share}
		in:fly={{ y: 20, duration: 500 }}
		class="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[var(--color-deep-forest)] text-[var(--color-cream)] px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group border border-white/10"
		class:scale-90={isCopied}
		aria-label="Compartilhar o Bazar da Ábi"
	>
		{#if isCopied}
			<div in:scale={{ duration: 200 }} class="flex items-center gap-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5 text-green-400"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M5 13l4 4L19 7"
					/>
				</svg>
				<span class="font-bold text-xs uppercase tracking-wider">Copiado!</span>
			</div>
		{:else}
			<div in:scale={{ duration: 200 }} class="flex items-center gap-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5 group-hover:rotate-12 transition-transform"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
					/>
				</svg>
				<span class="font-bold text-sm pr-1">Compartilhar</span>
			</div>
		{/if}
	</button>
{/if}
