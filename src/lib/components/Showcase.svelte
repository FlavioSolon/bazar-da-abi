<script>
	// Showcase Section (Vitrine)
	const products = [
		{
			id: 1,
			title: 'Vestido Floral',
			price: 'R$ 45,00',
			img: 'https://placehold.co/400x500/e2e8f0/1a3c34?text=Vestido'
		},
		{
			id: 2,
			title: 'Livro Design',
			price: 'R$ 30,00',
			img: 'https://placehold.co/400x500/e2e8f0/1a3c34?text=Livro'
		},
		{
			id: 3,
			title: 'Bolsa Artesanal',
			price: 'R$ 60,00',
			img: 'https://placehold.co/400x500/e2e8f0/1a3c34?text=Bolsa'
		},
		{
			id: 4,
			title: 'Sandália Couro',
			price: 'R$ 50,00',
			img: 'https://placehold.co/400x500/e2e8f0/1a3c34?text=Sandalia'
		},
		{
			id: 5,
			title: 'Chapéu Palha',
			price: 'R$ 35,00',
			img: 'https://placehold.co/400x500/e2e8f0/1a3c34?text=Chapeu'
		},
		{
			id: 6,
			title: 'Câmera Vintage',
			price: 'R$ 120,00',
			img: 'https://placehold.co/400x500/e2e8f0/1a3c34?text=Camera'
		}
	];
</script>

<section id="vitrine" class="py-20 px-6 bg-[var(--color-deep-forest)] relative overflow-hidden">
	<!-- Subtle Fern Texture Overlay (CSS pattern simulation) -->
	<div
		class="absolute inset-0 opacity-5 pointer-events-none"
		style="background-image: radial-gradient(#fff 1px, transparent 1px); background-size: 20px 20px;"
	></div>

	<div class="container mx-auto relative z-10">
		<div class="text-center mb-16">
			<h2 class="font-display text-5xl text-[var(--color-cream)] mb-4">A Vitrine</h2>
			<div class="w-24 h-1 bg-[var(--color-sunset-orange)] mx-auto rounded-full"></div>
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
			{#each products as product}
				<div
					class="group bg-white p-4 pb-8 shadow-xl transform rotate-1 hover:rotate-0 hover:scale-105 transition duration-300 ease-out cursor-pointer"
				>
					<div class="aspect-[4/5] overflow-hidden mb-4 bg-gray-200">
						<img src={product.img} alt={product.title} class="w-full h-full object-cover" />
					</div>
					<div class="text-center">
						<h3 class="font-display text-3xl text-[var(--color-deep-forest)] mb-2">
							{product.title}
						</h3>
						<p class="font-body text-xl font-bold text-[var(--color-sunset-orange)]">
							{product.price}
						</p>
						<button
							class="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[var(--color-deep-forest)] text-white px-6 py-2 rounded-full text-sm uppercase tracking-wider"
						>
							Eu Quero
						</button>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
