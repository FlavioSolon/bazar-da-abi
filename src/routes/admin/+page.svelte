<script>
	import { fade, fly, slide } from 'svelte/transition';
	export let data;
	export let form;

	let searchTerm = '';
	let selectedCategory = 'Todos';
	let showAddForm = false;

	const categories = [
		'Todos',
		'Blazer',
		'Short',
		'Tênis',
		'Acessórios',
		'Camisa',
		'Calças',
		'Vestidos'
	];

	$: filteredProducts = data.products.filter((product) => {
		const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
		return matchesSearch && matchesCategory;
	});
</script>

<div class="min-h-screen bg-gray-50 pb-20">
	<!-- Header -->
	<header
		class="bg-[var(--color-deep-forest)] text-[var(--color-cream)] py-6 px-4 shadow-lg sticky top-0 z-40"
	>
		<div class="container mx-auto flex justify-between items-center">
			<h1 class="font-display text-2xl md:text-3xl">Painel Admin</h1>
			<a
				href="/"
				class="text-sm font-bold hover:text-[var(--color-sunset-orange)] transition-colors"
			>
				Ver Loja &rarr;
			</a>
		</div>
	</header>

	<div class="container mx-auto p-4 max-w-6xl -mt-8 relative z-10">
		<!-- Feedback Message -->
		{#if form?.message}
			<div
				class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-md"
				role="alert"
				in:fly={{ y: -20, duration: 500 }}
			>
				<p class="font-bold">Atenção</p>
				<p>{form.message}</p>
			</div>
		{/if}

		<!-- Add Product Section -->
		<div class="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
			<button
				class="w-full flex justify-between items-center p-6 bg-white hover:bg-gray-50 transition-colors text-left"
				on:click={() => (showAddForm = !showAddForm)}
			>
				<div>
					<h2 class="text-xl font-display text-[var(--color-deep-forest)]">
						Adicionar Novo Produto
					</h2>
					<p class="text-gray-500 text-sm mt-1">
						Clique para {showAddForm ? 'fechar' : 'abrir'} o formulário
					</p>
				</div>
				<div
					class="bg-[var(--color-cream)] text-[var(--color-deep-forest)] w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl transition-transform duration-300 {showAddForm
						? 'rotate-45'
						: ''}"
				>
					+
				</div>
			</button>

			{#if showAddForm}
				<div transition:slide class="border-t border-gray-100 p-6 bg-gray-50/50">
					<form method="POST" action="?/create" class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div class="md:col-span-2">
							<label
								class="block text-[var(--color-deep-forest)] text-sm font-bold mb-2"
								for="title">Título do Produto</label
							>
							<input
								class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[var(--color-sunset-orange)] focus:ring-2 focus:ring-[var(--color-sunset-orange)]/20 outline-none transition-all text-[var(--color-deep-forest)] placeholder-gray-400"
								id="title"
								name="title"
								type="text"
								placeholder="Ex: Vestido Floral Vintage"
								required
							/>
						</div>

						<div>
							<label
								class="block text-[var(--color-deep-forest)] text-sm font-bold mb-2"
								for="price">Preço</label
							>
							<input
								class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[var(--color-sunset-orange)] focus:ring-2 focus:ring-[var(--color-sunset-orange)]/20 outline-none transition-all text-[var(--color-deep-forest)] placeholder-gray-400"
								id="price"
								name="price"
								type="text"
								placeholder="Ex: R$ 45,00"
								required
							/>
						</div>

						<div>
							<label
								class="block text-[var(--color-deep-forest)] text-sm font-bold mb-2"
								for="category">Categoria</label
							>
							<select
								class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[var(--color-sunset-orange)] focus:ring-2 focus:ring-[var(--color-sunset-orange)]/20 outline-none transition-all bg-white text-base text-[var(--color-deep-forest)]"
								id="category"
								name="category"
								required
							>
								<option value="" disabled selected>Selecione...</option>
								{#each categories.filter((c) => c !== 'Todos') as cat}
									<option value={cat}>{cat}</option>
								{/each}
							</select>
						</div>

						<div>
							<label
								class="block text-[var(--color-deep-forest)] text-sm font-bold mb-2"
								for="image_url">URL da Imagem</label
							>
							<input
								class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[var(--color-sunset-orange)] focus:ring-2 focus:ring-[var(--color-sunset-orange)]/20 outline-none transition-all text-[var(--color-deep-forest)] placeholder-gray-400"
								id="image_url"
								name="image_url"
								type="text"
								placeholder="https://..."
								required
							/>
						</div>

						<div>
							<label
								class="block text-[var(--color-deep-forest)] text-sm font-bold mb-2"
								for="buy_link">Link de Compra</label
							>
							<input
								class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[var(--color-sunset-orange)] focus:ring-2 focus:ring-[var(--color-sunset-orange)]/20 outline-none transition-all text-[var(--color-deep-forest)] placeholder-gray-400"
								id="buy_link"
								name="buy_link"
								type="text"
								placeholder="https://wa.me/..."
								required
							/>
						</div>

						<div class="md:col-span-2 flex justify-end mt-4">
							<button
								class="bg-[var(--color-deep-forest)] hover:bg-[var(--color-sunset-orange)] text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition hover:-translate-y-1 hover:shadow-xl"
								type="submit"
							>
								Salvar Produto
							</button>
						</div>
					</form>
				</div>
			{/if}
		</div>

		<!-- Search & Filter Bar -->
		<div
			class="bg-white rounded-xl shadow-md p-4 mb-6 flex flex-col md:flex-row gap-4 items-center sticky top-20 z-30 border border-gray-100"
		>
			<div class="relative w-full md:flex-1">
				<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
					<span class="text-gray-400">🔍</span>
				</div>
				<input
					type="text"
					bind:value={searchTerm}
					placeholder="Buscar por nome..."
					class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-[var(--color-deep-forest)] focus:ring-1 focus:ring-[var(--color-deep-forest)] outline-none text-[var(--color-deep-forest)] placeholder-gray-400"
				/>
			</div>

			<div class="w-full md:w-auto">
				<select
					bind:value={selectedCategory}
					class="w-full md:w-48 px-4 py-2 rounded-lg border border-gray-200 focus:border-[var(--color-deep-forest)] focus:ring-1 focus:ring-[var(--color-deep-forest)] outline-none bg-white text-base text-[var(--color-deep-forest)]"
				>
					{#each categories as cat}
						<option value={cat}>{cat}</option>
					{/each}
				</select>
			</div>
		</div>

		<!-- Products List -->
		<div class="bg-white shadow-xl rounded-2xl overflow-hidden">
			<div class="p-6 border-b border-gray-100 flex justify-between items-center">
				<h2 class="text-xl font-display text-[var(--color-deep-forest)]">
					Produtos Cadastrados
					<span class="text-sm font-sans text-gray-400 ml-2">({filteredProducts.length})</span>
				</h2>
			</div>

			<!-- Desktop Table -->
			<div class="hidden md:block overflow-x-auto">
				<table class="w-full text-left border-collapse">
					<thead>
						<tr class="bg-gray-50 text-[var(--color-deep-forest)] text-sm uppercase tracking-wider">
							<th class="px-6 py-4 font-bold">Produto</th>
							<th class="px-6 py-4 font-bold">Categoria</th>
							<th class="px-6 py-4 font-bold">Preço</th>
							<th class="px-6 py-4 font-bold text-center">Visibilidade</th>
							<th class="px-6 py-4 font-bold text-right">Ações</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-100">
						{#each filteredProducts as product (product.id)}
							<tr class="hover:bg-gray-50 transition-colors group">
								<td class="px-6 py-4">
									<div class="flex items-center gap-4">
										<div class="h-12 w-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
											<img
												src={product.image_url}
												alt={product.title}
												class="h-full w-full object-cover"
											/>
										</div>
										<span class="font-medium text-gray-900">{product.title}</span>
									</div>
								</td>
								<td class="px-6 py-4">
									<span
										class="px-3 py-1 rounded-full text-xs font-bold bg-[var(--color-cream)] text-[var(--color-deep-forest)]"
									>
										{product.category}
									</span>
								</td>
								<td class="px-6 py-4 font-bold text-[var(--color-sunset-orange)]">
									{product.price}
								</td>
								<td class="px-6 py-4 text-center">
									<form method="POST" action="?/toggleVisibility" class="inline-block">
										<input type="hidden" name="id" value={product.id} />
										<input type="hidden" name="is_visible" value={product.is_visible} />
										<button
											type="submit"
											class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-deep-forest)] focus:ring-offset-2
											{product.is_visible ? 'bg-[var(--color-deep-forest)]' : 'bg-gray-200'}"
										>
											<span
												class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform
												{product.is_visible ? 'translate-x-6' : 'translate-x-1'}"
											/>
										</button>
									</form>
								</td>
								<td class="px-6 py-4 text-right">
									<form
										method="POST"
										action="?/delete"
										class="inline-block"
										on:submit|preventDefault={(e) =>
											confirm('Tem certeza que deseja excluir este produto?') && e.target.submit()}
									>
										<input type="hidden" name="id" value={product.id} />
										<button
											type="submit"
											class="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
											title="Excluir"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-5 w-5"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
												/>
											</svg>
										</button>
									</form>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<!-- Mobile Cards -->
			<div class="md:hidden grid grid-cols-1 gap-4 p-4 bg-gray-50">
				{#each filteredProducts as product (product.id)}
					<div
						class="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex gap-4 items-start"
						in:fly={{ y: 20, duration: 300 }}
					>
						<div class="h-24 w-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
							<img src={product.image_url} alt={product.title} class="h-full w-full object-cover" />
						</div>

						<div class="flex-1 min-w-0">
							<div class="flex justify-between items-start mb-1">
								<span
									class="px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--color-cream)] text-[var(--color-deep-forest)] uppercase tracking-wide"
								>
									{product.category}
								</span>
								<form
									method="POST"
									action="?/delete"
									on:submit|preventDefault={(e) => confirm('Excluir?') && e.target.submit()}
								>
									<input type="hidden" name="id" value={product.id} />
									<button type="submit" class="text-gray-400 hover:text-red-500 -mt-1 -mr-1 p-2">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-5 w-5"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
											/>
										</svg>
									</button>
								</form>
							</div>

							<h3
								class="font-bold text-[var(--color-deep-forest)] text-lg leading-tight mb-1 truncate"
							>
								{product.title}
							</h3>
							<p class="text-[var(--color-sunset-orange)] font-bold mb-3">{product.price}</p>

							<div class="flex items-center justify-between">
								<form method="POST" action="?/toggleVisibility" class="flex items-center gap-2">
									<input type="hidden" name="id" value={product.id} />
									<input type="hidden" name="is_visible" value={product.is_visible} />
									<span class="text-xs text-gray-500 font-medium"
										>{product.is_visible ? 'Visível' : 'Oculto'}</span
									>
									<button
										type="submit"
										class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none
										{product.is_visible ? 'bg-[var(--color-deep-forest)]' : 'bg-gray-200'}"
									>
										<span
											class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm
											{product.is_visible ? 'translate-x-6' : 'translate-x-1'}"
										/>
									</button>
								</form>
							</div>
						</div>
					</div>
				{/each}
			</div>

			{#if filteredProducts.length === 0}
				<div class="p-12 text-center text-gray-400">
					<p class="text-xl">Nenhum produto encontrado.</p>
				</div>
			{/if}
		</div>
	</div>
</div>
