<script>
	import Hero from '$lib/components/Hero.svelte';
	import About from '$lib/components/About.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Carousel from '$lib/components/Carousel.svelte';
	import { fly, fade } from 'svelte/transition';

	export let data;

	// State
	let activeFilter = 'Todos';
	let sortBy = 'newest'; // 'newest', 'price-asc', 'price-desc'
	let currentPage = 1;
	const itemsPerPage = 9;

	const categories = [
		'Todos',
		'Blazer',
		'Short',
		'Tênis',
		'Acessórios',
		'Camisa',
		'Calças',
		'Vestidos',
		'Casacos/Moletons',
		'Outros'
	];

	// Reactive Logic
	$: filteredProducts = data.products.filter((p) =>
		activeFilter === 'Todos' ? true : p.category === activeFilter
	);

	$: sortedProducts = [...filteredProducts].sort((a, b) => {
		if (sortBy === 'price-asc') {
			return (
				parseFloat(a.price.replace('R$', '').replace(',', '.').trim()) -
				parseFloat(b.price.replace('R$', '').replace(',', '.').trim())
			);
		} else if (sortBy === 'price-desc') {
			return (
				parseFloat(b.price.replace('R$', '').replace(',', '.').trim()) -
				parseFloat(a.price.replace('R$', '').replace(',', '.').trim())
			);
		} else {
			// Default sort: Position (ascending), then Newest (ID descending)
			const posA = a.position !== null && a.position !== undefined ? a.position : 999999;
			const posB = b.position !== null && b.position !== undefined ? b.position : 999999;

			if (posA !== posB) {
				return posA - posB;
			}
			return b.id - a.id;
		}
	});

	$: totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

	$: if (activeFilter || sortBy) currentPage = 1;

	$: paginatedProducts = sortedProducts.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	function goToPage(page) {
		if (page >= 1 && page <= totalPages) {
			currentPage = page;
			document.getElementById('vitrine')?.scrollIntoView({ behavior: 'smooth' });
		}
	}

	function getWhatsAppLink(product) {
		if (!product.buy_link) return '';

		// Check if it's a WhatsApp link
		if (product.buy_link.includes('wa.me') || product.buy_link.includes('whatsapp.com')) {
			const price = product.price.startsWith('R$') ? product.price : `R$ ${product.price}`;
			const message = `Olá! Vi este produto no Bazar da Abi e fiquei interessada:\n\n*${product.title}*\nPreço: ${price}\n\nAinda está disponível?`;
			const encodedMessage = encodeURIComponent(message);

			// If link already has params, append with &, otherwise ?
			const separator = product.buy_link.includes('?') ? '&' : '?';
			return `${product.buy_link}${separator}text=${encodedMessage}`;
		}

		return product.buy_link;
	}
</script>

<svelte:head>
	<title>Bazar da Abi | Desapegos com Propósito</title>
	<meta
		name="description"
		content="Bazar da Abi - Roupas, acessórios e muito mais. Todo valor arrecadado apoia missões."
	/>
</svelte:head>

<main class="w-full bg-gray-50">
	<Hero />
	<About />

	<section
		id="vitrine"
		class="py-24 px-4 sm:px-6 bg-[var(--color-deep-forest)] relative min-h-[800px]"
	>
		<div class="container mx-auto relative z-10 max-w-7xl">
			<div class="text-center mb-8">
				<h2
					class="font-curly text-4xl md:text-5xl text-[var(--color-cream)] mb-4"
					in:fly={{ y: -20, duration: 1000 }}
				>
					A Vitrine
				</h2>
				<div class="w-24 h-1 bg-[var(--color-sunset-orange)] mx-auto rounded-full"></div>
			</div>

			<!-- Sticky Controls Container -->
			<div
				class="sticky top-0 z-50 py-4 -mx-4 px-4 sm:mx-0 sm:px-0 bg-[var(--color-deep-forest)]/95 shadow-lg mb-8 transition-all duration-300 border-b border-white/10 sm:rounded-2xl sm:static sm:bg-white/5 sm:border sm:shadow-none"
				style="-webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px);"
			>
				<div class="flex flex-col md:flex-row justify-between items-center gap-4">
					<!-- Categories (Desktop: Buttons, Mobile: Select) -->
					<div class="w-full md:w-auto">
						<!-- Desktop/Tablet View -->
						<div class="hidden md:flex space-x-2 flex-wrap justify-center">
							{#each categories as category}
								<button
									class="px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 mb-2 md:mb-0
									{activeFilter === category
										? 'bg-[var(--color-sunset-orange)] text-white shadow-lg scale-105'
										: 'bg-[var(--color-cream)] text-[var(--color-deep-forest)] hover:bg-white hover:scale-105'}"
									on:click={() => (activeFilter = category)}
								>
									{category}
								</button>
							{/each}
						</div>

						<!-- Mobile View -->
						<div class="block md:hidden w-full">
							<label for="category-mobile" class="sr-only">Categoria</label>
							<select
								id="category-mobile"
								bind:value={activeFilter}
								class="w-full appearance-none bg-[var(--color-cream)] text-[var(--color-deep-forest)] font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-sunset-orange)] text-base shadow-sm"
							>
								{#each categories as category}
									<option value={category}>{category}</option>
								{/each}
							</select>
						</div>
					</div>

					<!-- Sort Dropdown -->
					<div class="w-full md:w-auto flex items-center justify-between md:justify-end">
						<label
							for="sort"
							class="text-[var(--color-cream)] mr-3 font-bold text-sm whitespace-nowrap"
							>Ordenar por:</label
						>
						<div class="relative flex-grow md:flex-grow-0">
							<select
								id="sort"
								bind:value={sortBy}
								class="w-full md:w-auto appearance-none bg-[var(--color-cream)] text-[var(--color-deep-forest)] font-bold py-2 pl-4 pr-10 rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--color-sunset-orange)] cursor-pointer text-base sm:text-sm"
							>
								<option value="newest">Destaques</option>
								<option value="price-asc">Menor Preço</option>
								<option value="price-desc">Maior Preço</option>
							</select>
							<div
								class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[var(--color-deep-forest)]"
							>
								<svg
									class="fill-current h-4 w-4"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									><path
										d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
									/></svg
								>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Products Grid -->
			{#if paginatedProducts.length > 0}
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mb-16">
					{#each paginatedProducts as product, i (product.id)}
						<div
							class="group bg-white p-4 pb-6 shadow-xl transform transition duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl relative flex flex-col"
							style="border-radius: {i % 2 === 0
								? '2% 1% 2% 1% / 1% 2% 1% 2%'
								: '1% 2% 1% 2% / 2% 1% 2% 1%'};"
							in:fly={{ y: 30, duration: 500, delay: i * 50 }}
						>
							<div class="aspect-[4/5] overflow-hidden mb-4 bg-gray-100 rounded-sm relative">
								<Carousel
									images={[product.image_1, product.image_2, product.image_3].filter(Boolean)}
									alt={product.title}
								/>
								{#if !product.is_visible}
									<div
										class="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm z-20"
									>
										<span class="text-white font-bold px-4 py-2 border-2 border-white rounded-lg"
											>VENDIDO</span
										>
									</div>
								{/if}
								<!-- Badge for Category -->
								<span
									class="absolute top-2 right-2 bg-[var(--color-deep-forest)] text-white text-xs font-bold px-2 py-1 rounded-sm opacity-90"
								>
									{product.category}
								</span>
							</div>

							<div class="text-center flex-grow flex flex-col justify-between">
								<div>
									<h3
										class="font-display text-2xl text-[var(--color-deep-forest)] mb-1 leading-tight"
									>
										{product.title}
									</h3>
									<p class="font-body text-xl font-bold text-[var(--color-sunset-orange)] mb-4">
										R$ {product.price}
									</p>
								</div>

								{#if product.buy_link}
									<a
										href={getWhatsAppLink(product)}
										target="_blank"
										rel="noopener noreferrer"
										class="inline-block w-full bg-[var(--color-deep-forest)] text-white px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-[var(--color-sunset-orange)] transition-colors duration-300 shadow-md hover:shadow-lg"
									>
										Eu Quero
									</a>
								{/if}
							</div>
						</div>
					{/each}
				</div>

				<!-- Pagination -->
				{#if totalPages > 1}
					<div class="flex justify-center items-center space-x-2 mt-8">
						<button
							class="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--color-cream)] text-[var(--color-deep-forest)] font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors"
							on:click={() => goToPage(currentPage - 1)}
							disabled={currentPage === 1}
						>
							&lt;
						</button>

						{#each Array(totalPages) as _, idx}
							<button
								class="w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300
								{currentPage === idx + 1
									? 'bg-[var(--color-sunset-orange)] text-white scale-110 shadow-md'
									: 'bg-[var(--color-cream)] text-[var(--color-deep-forest)] hover:bg-white'}"
								on:click={() => goToPage(idx + 1)}
							>
								{idx + 1}
							</button>
						{/each}

						<button
							class="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--color-cream)] text-[var(--color-deep-forest)] font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors"
							on:click={() => goToPage(currentPage + 1)}
							disabled={currentPage === totalPages}
						>
							&gt;
						</button>
					</div>
				{/if}
			{:else}
				<div
					class="text-center py-20 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 mx-auto max-w-2xl"
					in:fade
				>
					<div class="text-6xl mb-4">🍂</div>
					<h3 class="font-display text-3xl text-[var(--color-cream)] mb-2">Ops! Nada por aqui.</h3>
					<p class="text-[var(--color-cream)] opacity-80 text-lg">
						Não encontramos produtos nesta categoria no momento.
					</p>
					<button
						class="mt-6 text-[var(--color-sunset-orange)] font-bold hover:underline"
						on:click={() => (activeFilter = 'Todos')}
					>
						Ver todos os produtos
					</button>
				</div>
			{/if}
		</div>
	</section>

	<Footer />
</main>

<style>
	/* Hide scrollbar for Chrome, Safari and Opera */
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}

	/* Hide scrollbar for IE, Edge and Firefox */
	.scrollbar-hide {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}
</style>
