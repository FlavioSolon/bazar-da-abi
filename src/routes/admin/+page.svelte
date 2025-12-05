<script>
	import { fade, fly, slide, scale } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import { dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';

	export let data;
	export let form;

	let searchTerm = '';
	let selectedCategory = 'Todos';
	let visibilityFilter = 'all'; // 'all', 'visible', 'hidden'
	let currentPage = 1;
	const itemsPerPage = 10;

	let showAddForm = false;
	let isAuthenticated = false;
	let isChecking = true;
	let passwordInput = '';
	let authError = false;
	let isSubmitting = false; // Loading state for submission

	// Delete Modal State
	let showDeleteModal = false;
	let productToDelete = null;

	// Image Modal State
	let showImageModal = false;
	let selectedImage = null;

	// Edit State
	let editingProduct = null;

	// Reorder State
	let isReordering = false;
	let reorderItems = [];
	let isSavingOrder = false;

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

	onMount(() => {
		if (sessionStorage.getItem('admin_authenticated') === 'true') {
			isAuthenticated = true;
		}
		isChecking = false;
	});

	function handleLogin() {
		if (passwordInput.toLowerCase() === 'ohana') {
			isAuthenticated = true;
			sessionStorage.setItem('admin_authenticated', 'true');
			authError = false;
		} else {
			authError = true;
			passwordInput = '';
			setTimeout(() => (authError = false), 2000);
		}
	}

	function promptDelete(id) {
		productToDelete = id;
		showDeleteModal = true;
	}

	function closeDeleteModal() {
		showDeleteModal = false;
		setTimeout(() => (productToDelete = null), 300); // Clear after animation
	}

	function openImageModal(url) {
		selectedImage = url;
		showImageModal = true;
	}

	function closeImageModal() {
		showImageModal = false;
		setTimeout(() => (selectedImage = null), 300);
	}

	function startEdit(product) {
		editingProduct = product;
		showAddForm = true;
		// Scroll to form
		setTimeout(() => {
			document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' });
		}, 100);
	}

	function cancelEdit() {
		editingProduct = null;
		showAddForm = false;
	}

	function toggleReorder() {
		isReordering = !isReordering;
		if (isReordering) {
			// Sync filter state when entering mode
			lastFilterState = JSON.stringify({ selectedCategory, searchTerm, visibilityFilter });

			// Initialize items
			reorderItems = [...filteredProducts].sort((a, b) => (a.position || 0) - (b.position || 0));
			if (reorderItems.every((p) => !p.position)) {
				reorderItems.sort((a, b) => b.id - a.id);
			}
		}
	}

	// Track filter state to only update reorderItems when filters actually change
	let lastFilterState = JSON.stringify({ selectedCategory, searchTerm, visibilityFilter });

	$: if (isReordering) {
		const currentFilterState = JSON.stringify({ selectedCategory, searchTerm, visibilityFilter });
		if (currentFilterState !== lastFilterState) {
			lastFilterState = currentFilterState;
			// Update reorderItems only when filters change
			reorderItems = [...filteredProducts].sort((a, b) => (a.position || 0) - (b.position || 0));

			if (reorderItems.every((p) => !p.position)) {
				reorderItems.sort((a, b) => b.id - a.id);
			}
		}
	}

	function sortByCategories() {
		// Sort by category name, then by title
		reorderItems = [...reorderItems].sort((a, b) => {
			const catCompare = a.category.localeCompare(b.category);
			if (catCompare !== 0) return catCompare;
			return a.title.localeCompare(b.title);
		});
	}

	function handleDndConsider(e) {
		reorderItems = e.detail.items;
	}

	function handleDndFinalize(e) {
		reorderItems = e.detail.items;
	}

	async function saveOrder() {
		isSavingOrder = true;

		// We need to calculate the new positions relative to the GLOBAL list.
		// 1. Get all products sorted by their current position (or default sort)
		let allProducts = [...data.products].sort((a, b) => (a.position || 0) - (b.position || 0));
		if (allProducts.every((p) => !p.position)) {
			allProducts.sort((a, b) => b.id - a.id);
		}

		// 2. Identify the indices of the items currently being reordered
		// We filter allProducts to find the items that are in reorderItems
		// This gives us the "slots" that these items occupy in the global list.
		const reorderIds = new Set(reorderItems.map((i) => i.id));
		const indicesToUpdate = [];

		allProducts.forEach((item, index) => {
			if (reorderIds.has(item.id)) {
				indicesToUpdate.push(index);
			}
		});

		// 3. Map the new order to these indices
		// reorderItems[0] goes to indicesToUpdate[0]
		// reorderItems[1] goes to indicesToUpdate[1]
		// ...
		const updates = reorderItems.map((item, i) => ({
			id: item.id,
			position: indicesToUpdate[i]
		}));

		try {
			const orderInput = document.getElementById('orderInput');
			if (orderInput) {
				orderInput.value = JSON.stringify(updates);
			}

			document.getElementById('saveOrderForm').requestSubmit();
		} catch (error) {
			console.error('Error saving order:', error);
			alert('Erro ao salvar a ordem.');
			isSavingOrder = false;
		}
	}

	$: filteredProducts = data.products.filter((product) => {
		const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
		const matchesVisibility =
			visibilityFilter === 'all'
				? true
				: visibilityFilter === 'visible'
					? product.is_visible
					: !product.is_visible;

		return matchesSearch && matchesCategory && matchesVisibility;
	});

	$: {
		// Reset to page 1 when filters change
		if (searchTerm || selectedCategory || visibilityFilter) {
			currentPage = 1;
		}
	}

	$: totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

	$: paginatedProducts = filteredProducts.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	function goToPage(page) {
		if (page >= 1 && page <= totalPages) {
			currentPage = page;
			// Optional: Scroll to top of list
			document.getElementById('products-list')?.scrollIntoView({ behavior: 'smooth' });
		}
	}

	// Custom enhance function to handle HEIC conversion
	const handleSubmit = async ({ formData, cancel }) => {
		isSubmitting = true;

		// Dynamically import heic2any to avoid SSR issues
		const heic2any = (await import('heic2any')).default;

		const processFile = async (fieldName) => {
			const file = formData.get(fieldName);
			if (
				file &&
				file.size > 0 &&
				(file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif'))
			) {
				try {
					console.log(`Converting ${fieldName}...`);
					const convertedBlob = await heic2any({
						blob: file,
						toType: 'image/jpeg',
						quality: 0.8
					});

					// Handle case where heic2any returns an array (for multi-image HEIC)
					const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;

					const newFile = new File([blob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), {
						type: 'image/jpeg'
					});

					formData.set(fieldName, newFile);
					console.log(`${fieldName} converted to JPEG`);
				} catch (error) {
					console.error(`Error converting ${fieldName}:`, error);
					// Optionally alert the user or let the server handle the invalid file
					alert(`Erro ao converter imagem ${file.name}. Tente enviar uma JPG ou PNG.`);
					cancel();
					isSubmitting = false;
				}
			}
		};

		await processFile('image_1');
		await processFile('image_2');
		await processFile('image_3');

		return async ({ update }) => {
			await update();
			isSubmitting = false;
			showAddForm = false; // Close form on success
			editingProduct = null;
		};
	};
</script>

{#if isChecking}
	<div class="min-h-screen bg-gray-50"></div>
{:else if !isAuthenticated}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-deep-forest)]"
		in:fade
	>
		<!-- Background Pattern -->
		<div
			class="absolute inset-0 opacity-10 pointer-events-none"
			style="background-image: radial-gradient(#fff 1px, transparent 1px); background-size: 30px 30px;"
		></div>

		<div
			class="bg-white/95 backdrop-blur-sm p-10 rounded-3xl shadow-2xl max-w-md w-full mx-4 text-center relative overflow-hidden border border-white/20"
			in:scale={{ start: 0.95, duration: 400 }}
		>
			<!-- Decorative header -->
			<div
				class="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-[var(--color-sunset-orange)] via-yellow-500 to-[var(--color-deep-forest)]"
			></div>

			<div class="mb-8 mt-2">
				<h2 class="font-display text-4xl text-[var(--color-deep-forest)] mb-3 leading-tight">
					Família significa que ninguém fica para trás.
				</h2>
				<p class="font-display text-2xl text-[var(--color-deep-forest)]/80 italic">
					Significa nunca abandonar, nunca desisitir.
				</p>
			</div>

			<form on:submit|preventDefault={handleLogin} class="space-y-6">
				<div class="relative group">
					<input
						type="password"
						bind:value={passwordInput}
						placeholder="Palavra passe..."
						class="w-full px-6 py-4 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-[var(--color-sunset-orange)] focus:ring-4 focus:ring-[var(--color-sunset-orange)]/10 outline-none transition-all text-center text-xl text-[var(--color-deep-forest)] placeholder-gray-300 font-display tracking-widest {authError
							? 'border-red-500 animate-pulse'
							: ''}"
						autofocus
					/>
				</div>

				<button
					type="submit"
					class="w-full bg-gradient-to-r from-[var(--color-deep-forest)] to-[#2a5c50] hover:from-[var(--color-sunset-orange)] hover:to-[#ff8c3a] text-white font-bold py-4 px-8 rounded-xl shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl text-lg tracking-wide"
				>
					Entrar
				</button>
			</form>

			{#if authError}
				<p
					class="text-red-500 text-sm mt-4 font-bold bg-red-50 py-2 px-4 rounded-lg inline-block"
					in:fly={{ y: 10 }}
				>
					Palavra passe incorreta. Tente novamente.
				</p>
			{/if}

			<div class="mt-8 text-xs text-gray-400 font-sans">Área restrita para a família</div>
		</div>
	</div>
{:else}
	<div class="min-h-screen bg-gray-50 pb-20 admin-font" in:fade>
		<!-- Header -->
		<header
			class="bg-[var(--color-deep-forest)] text-[var(--color-cream)] py-6 px-4 shadow-lg sticky top-0 z-40"
		>
			<div class="container mx-auto flex justify-between items-center">
				<h1 class="font-display text-2xl md:text-3xl">Painel Admin</h1>
				<div class="flex items-center gap-4">
					<button
						class="text-sm font-bold bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-colors"
						on:click={toggleReorder}
					>
						{isReordering ? 'Sair da Ordenação' : 'Ordenar Produtos'}
					</button>
					<a
						href="/"
						class="text-sm font-bold hover:text-[var(--color-sunset-orange)] transition-colors"
					>
						Ver Loja &rarr;
					</a>
				</div>
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
					{#if form.message.includes('position') || form.message.includes('PGRST204')}
						<div class="mt-4 bg-white p-4 rounded border border-red-200">
							<p class="font-bold text-red-800 mb-2">Ação Necessária no Banco de Dados:</p>
							<p class="text-sm text-gray-700 mb-2">
								Você precisa criar a coluna de posição no Supabase. Execute este comando no SQL
								Editor:
							</p>
							<code class="block bg-gray-100 p-2 rounded text-sm font-mono select-all">
								ALTER TABLE products ADD COLUMN position INTEGER DEFAULT 0;
							</code>
						</div>
					{/if}
				</div>
			{/if}
			{#if form?.success}
				<div
					class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded shadow-md"
					role="alert"
					in:fly={{ y: -20, duration: 500 }}
				>
					<p class="font-bold">Sucesso</p>
					<p>Operação realizada com sucesso!</p>
				</div>
			{/if}

			{#if isReordering}
				<!-- Reorder Mode -->
				<div class="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 p-6" in:fade>
					<div class="flex justify-between items-center mb-6">
						<div class="flex items-center gap-4">
							<div>
								<h2 class="text-2xl font-display text-[var(--color-deep-forest)]">
									Ordenar Produtos
								</h2>
								<p class="text-gray-500 text-sm">
									Arraste os itens para mudar a ordem de exibição.
								</p>
							</div>

							<!-- Category Filter for Reorder -->
							<select
								bind:value={selectedCategory}
								class="px-4 py-2 rounded-lg border border-gray-200 focus:border-[var(--color-sunset-orange)] focus:ring-1 focus:ring-[var(--color-sunset-orange)] outline-none bg-white text-sm text-[var(--color-deep-forest)] font-bold"
							>
								{#each categories as cat}
									<option value={cat}>{cat}</option>
								{/each}
							</select>

							<button
								type="button"
								on:click={sortByCategories}
								class="text-sm font-bold text-[var(--color-sunset-orange)] hover:text-orange-600 border border-[var(--color-sunset-orange)] px-3 py-1 rounded-full hover:bg-orange-50 transition-colors"
								title="Agrupa automaticamente todos os produtos por categoria"
							>
								Auto-agrupar por Categoria
							</button>
						</div>
						<form
							method="POST"
							action="?/updateOrder"
							id="saveOrderForm"
							use:enhance={() => {
								isSavingOrder = true;
								return async ({ update, result }) => {
									await update();
									isSavingOrder = false;
									if (result.type === 'success') {
										isReordering = false;
									}
								};
							}}
						>
							<!-- The value is set dynamically by saveOrder function before submit, 
							     but we need a binding or a way to pass the calculated updates.
							     Actually, saveOrder calculates 'updates' but the form input below uses 'reorderItems'.
							     We need to update the input value manually or bind it to a variable that saveOrder updates.
							-->
							<input type="hidden" name="order" id="orderInput" />
							<button
								type="button"
								on:click={saveOrder}
								class="bg-[var(--color-sunset-orange)] hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition hover:-translate-y-1 hover:shadow-xl disabled:opacity-50"
								disabled={isSavingOrder}
							>
								{isSavingOrder ? 'Salvando...' : 'Salvar Ordem'}
							</button>
						</form>
					</div>

					<div
						use:dndzone={{
							items: reorderItems,
							flipDurationMs: 300,
							dropTargetStyle: {
								outline: '2px solid var(--color-sunset-orange)',
								borderRadius: '0.5rem'
							}
						}}
						on:consider={handleDndConsider}
						on:finalize={handleDndFinalize}
						class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
					>
						{#each reorderItems as item (item.id)}
							<div
								class="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4 cursor-move hover:border-[var(--color-sunset-orange)] transition-colors"
								animate:flip={{ duration: 300 }}
							>
								<div class="text-gray-400 font-bold text-xl">☰</div>
								{#if item.image_1}
									<img
										src={item.image_1}
										alt={item.title}
										class="h-16 w-16 object-cover rounded-lg bg-gray-200"
									/>
								{:else}
									<div
										class="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs"
									>
										Sem img
									</div>
								{/if}
								<div class="flex-1 min-w-0">
									<h3 class="font-bold text-[var(--color-deep-forest)] truncate">{item.title}</h3>
									<p class="text-sm text-gray-500">{item.category} • {item.price}</p>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{:else}
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
							<div class="flex justify-between items-center mb-4">
								<h3 class="text-lg font-bold text-[var(--color-deep-forest)]">
									{editingProduct ? 'Editar Produto' : 'Novo Produto'}
								</h3>
								{#if editingProduct}
									<button
										on:click={cancelEdit}
										class="text-sm text-red-500 hover:underline font-bold"
									>
										Cancelar Edição
									</button>
								{/if}
							</div>
							<form
								method="POST"
								action={editingProduct ? '?/update' : '?/create'}
								use:enhance={handleSubmit}
								enctype="multipart/form-data"
								class="grid grid-cols-1 md:grid-cols-2 gap-6"
							>
								{#if editingProduct}
									<input type="hidden" name="id" value={editingProduct.id} />
								{/if}

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
										value={editingProduct?.title || ''}
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
										value={editingProduct?.price || ''}
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
										value={editingProduct?.category || ''}
										required
									>
										<option value="" disabled selected={!editingProduct}>Selecione...</option>
										{#each categories.filter((c) => c !== 'Todos') as cat}
											<option value={cat}>{cat}</option>
										{/each}
									</select>
								</div>

								<div class="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
									<div>
										<label
											class="block text-[var(--color-deep-forest)] text-sm font-bold mb-2"
											for="image_1"
											>Imagem Principal {editingProduct ? '(Opcional)' : '(Obrigatória)'}</label
										>
										{#if editingProduct?.image_1}
											<div class="mb-2">
												<button
													type="button"
													class="relative group overflow-hidden rounded-lg border border-gray-200 hover:border-[var(--color-sunset-orange)] transition-colors"
													on:click={() => openImageModal(editingProduct.image_1)}
												>
													<img
														src={editingProduct.image_1}
														alt="Imagem Principal"
														class="h-20 w-20 object-cover"
													/>
													<div
														class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center"
													>
														<span
															class="text-white opacity-0 group-hover:opacity-100 text-xs font-bold bg-black/50 px-2 py-1 rounded"
															>Ver</span
														>
													</div>
												</button>
											</div>
										{/if}
										<input
											class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[var(--color-sunset-orange)] focus:ring-2 focus:ring-[var(--color-sunset-orange)]/20 outline-none transition-all text-[var(--color-deep-forest)] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-deep-forest)] file:text-white hover:file:bg-[var(--color-sunset-orange)]"
											id="image_1"
											name="image_1"
											type="file"
											accept="image/*,.heic,.heif"
											required={!editingProduct}
										/>
									</div>
									<div>
										<label
											class="block text-[var(--color-deep-forest)] text-sm font-bold mb-2"
											for="image_2">Imagem 2 (Opcional)</label
										>
										{#if editingProduct?.image_2}
											<div class="mb-2">
												<button
													type="button"
													class="relative group overflow-hidden rounded-lg border border-gray-200 hover:border-[var(--color-sunset-orange)] transition-colors"
													on:click={() => openImageModal(editingProduct.image_2)}
												>
													<img
														src={editingProduct.image_2}
														alt="Imagem 2"
														class="h-20 w-20 object-cover"
													/>
													<div
														class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center"
													>
														<span
															class="text-white opacity-0 group-hover:opacity-100 text-xs font-bold bg-black/50 px-2 py-1 rounded"
															>Ver</span
														>
													</div>
												</button>
											</div>
										{/if}
										<input
											class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[var(--color-sunset-orange)] focus:ring-2 focus:ring-[var(--color-sunset-orange)]/20 outline-none transition-all text-[var(--color-deep-forest)] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-deep-forest)] file:text-white hover:file:bg-[var(--color-sunset-orange)]"
											id="image_2"
											name="image_2"
											type="file"
											accept="image/*,.heic,.heif"
										/>
									</div>
									<div>
										<label
											class="block text-[var(--color-deep-forest)] text-sm font-bold mb-2"
											for="image_3">Imagem 3 (Opcional)</label
										>
										{#if editingProduct?.image_3}
											<div class="mb-2">
												<button
													type="button"
													class="relative group overflow-hidden rounded-lg border border-gray-200 hover:border-[var(--color-sunset-orange)] transition-colors"
													on:click={() => openImageModal(editingProduct.image_3)}
												>
													<img
														src={editingProduct.image_3}
														alt="Imagem 3"
														class="h-20 w-20 object-cover"
													/>
													<div
														class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center"
													>
														<span
															class="text-white opacity-0 group-hover:opacity-100 text-xs font-bold bg-black/50 px-2 py-1 rounded"
															>Ver</span
														>
													</div>
												</button>
											</div>
										{/if}
										<input
											class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[var(--color-sunset-orange)] focus:ring-2 focus:ring-[var(--color-sunset-orange)]/20 outline-none transition-all text-[var(--color-deep-forest)] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-deep-forest)] file:text-white hover:file:bg-[var(--color-sunset-orange)]"
											id="image_3"
											name="image_3"
											type="file"
											accept="image/*,.heic,.heif"
										/>
									</div>
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
										value={editingProduct?.buy_link || 'https://wa.me/5592981496477'}
										required
									/>
								</div>

								<div class="md:col-span-2 flex justify-end mt-4">
									<button
										class="bg-[var(--color-deep-forest)] hover:bg-[var(--color-sunset-orange)] text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition hover:-translate-y-1 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
										type="submit"
										disabled={isSubmitting}
									>
										{isSubmitting
											? 'Salvando...'
											: editingProduct
												? 'Atualizar Produto'
												: 'Salvar Produto'}
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

					<div class="w-full md:w-auto">
						<select
							bind:value={visibilityFilter}
							class="w-full md:w-48 px-4 py-2 rounded-lg border border-gray-200 focus:border-[var(--color-deep-forest)] focus:ring-1 focus:ring-[var(--color-deep-forest)] outline-none bg-white text-base text-[var(--color-deep-forest)]"
						>
							<option value="all">Todos Status</option>
							<option value="visible">Visíveis</option>
							<option value="hidden">Ocultos</option>
						</select>
					</div>
				</div>

				<!-- Products List -->
				<div id="products-list" class="bg-white shadow-xl rounded-2xl overflow-hidden">
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
								<tr
									class="bg-gray-50 text-[var(--color-deep-forest)] text-sm uppercase tracking-wider"
								>
									<th class="px-6 py-4 font-bold">Produto</th>
									<th class="px-6 py-4 font-bold">Categoria</th>
									<th class="px-6 py-4 font-bold">Preço</th>
									<th class="px-6 py-4 font-bold text-center">Visibilidade</th>
									<th class="px-6 py-4 font-bold text-right">Ações</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-gray-100">
								{#each paginatedProducts as product (product.id)}
									<tr class="hover:bg-gray-50 transition-colors group">
										<td class="px-6 py-4">
											<div class="flex items-center gap-4">
												<div class="flex -space-x-4 hover:space-x-1 transition-all">
													{#if product.image_1}
														<button
															type="button"
															class="h-12 w-12 rounded-lg overflow-hidden bg-gray-100 ring-2 ring-white z-30 cursor-pointer hover:ring-[var(--color-sunset-orange)] transition-all"
															on:click={() => openImageModal(product.image_1)}
														>
															<img
																src={product.image_1}
																alt={product.title}
																class="h-full w-full object-cover"
															/>
														</button>
													{/if}
													{#if product.image_2}
														<button
															type="button"
															class="h-12 w-12 rounded-lg overflow-hidden bg-gray-100 ring-2 ring-white z-20 cursor-pointer hover:ring-[var(--color-sunset-orange)] transition-all"
															on:click={() => openImageModal(product.image_2)}
														>
															<img
																src={product.image_2}
																alt={product.title}
																class="h-full w-full object-cover"
															/>
														</button>
													{/if}
													{#if product.image_3}
														<button
															type="button"
															class="h-12 w-12 rounded-lg overflow-hidden bg-gray-100 ring-2 ring-white z-10 cursor-pointer hover:ring-[var(--color-sunset-orange)] transition-all"
															on:click={() => openImageModal(product.image_3)}
														>
															<img
																src={product.image_3}
																alt={product.title}
																class="h-full w-full object-cover"
															/>
														</button>
													{/if}
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
											<form
												method="POST"
												action="?/toggleVisibility"
												use:enhance
												class="inline-block"
											>
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
											<button
												on:click={() => startEdit(product)}
												class="text-gray-400 hover:text-[var(--color-sunset-orange)] transition-colors p-2 rounded-full hover:bg-orange-50 mr-2"
												title="Editar"
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
														d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
													/>
												</svg>
											</button>
											<button
												on:click={() => promptDelete(product.id)}
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
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>

					<!-- Mobile Cards -->
					<div class="md:hidden grid grid-cols-1 gap-4 p-4 bg-gray-50">
						{#each paginatedProducts as product (product.id)}
							<div
								class="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex gap-4 items-start"
								in:fly={{ y: 20, duration: 300 }}
							>
								<div class="flex flex-col gap-2">
									{#if product.image_1}
										<button
											type="button"
											class="h-24 w-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 cursor-pointer hover:ring-2 hover:ring-[var(--color-sunset-orange)] transition-all"
											on:click={() => openImageModal(product.image_1)}
										>
											<img
												src={product.image_1}
												alt={product.title}
												class="h-full w-full object-cover"
											/>
										</button>
									{/if}
									<div class="flex gap-2">
										{#if product.image_2}
											<button
												type="button"
												class="h-10 w-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 cursor-pointer hover:ring-2 hover:ring-[var(--color-sunset-orange)] transition-all"
												on:click={() => openImageModal(product.image_2)}
											>
												<img
													src={product.image_2}
													alt={product.title}
													class="h-full w-full object-cover"
												/>
											</button>
										{/if}
										{#if product.image_3}
											<button
												type="button"
												class="h-10 w-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 cursor-pointer hover:ring-2 hover:ring-[var(--color-sunset-orange)] transition-all"
												on:click={() => openImageModal(product.image_3)}
											>
												<img
													src={product.image_3}
													alt={product.title}
													class="h-full w-full object-cover"
												/>
											</button>
										{/if}
									</div>
								</div>

								<div class="flex-1 min-w-0">
									<div class="flex justify-between items-start mb-1">
										<span
											class="px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--color-cream)] text-[var(--color-deep-forest)] uppercase tracking-wide"
										>
											{product.category}
										</span>
										<button
											on:click={() => startEdit(product)}
											class="text-gray-400 hover:text-[var(--color-sunset-orange)] -mt-1 -mr-1 p-2"
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
													d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
												/>
											</svg>
										</button>
										<button
											on:click={() => promptDelete(product.id)}
											class="text-gray-400 hover:text-red-500 -mt-1 -mr-1 p-2"
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
									</div>

									<h3
										class="font-bold text-[var(--color-deep-forest)] text-lg leading-tight mb-1 truncate"
									>
										{product.title}
									</h3>
									<p class="text-[var(--color-sunset-orange)] font-bold mb-3">{product.price}</p>

									<div class="flex items-center justify-between">
										<form
											method="POST"
											action="?/toggleVisibility"
											use:enhance
											class="flex items-center gap-2"
										>
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

					<!-- Pagination Controls -->
					{#if totalPages > 1}
						<div class="p-6 border-t border-gray-100 flex justify-center items-center gap-2">
							<button
								class="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 text-[var(--color-deep-forest)] font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
								on:click={() => goToPage(currentPage - 1)}
								disabled={currentPage === 1}
							>
								&lt;
							</button>

							<span class="text-sm font-bold text-[var(--color-deep-forest)] mx-2">
								Página {currentPage} de {totalPages}
							</span>

							<button
								class="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 text-[var(--color-deep-forest)] font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
								on:click={() => goToPage(currentPage + 1)}
								disabled={currentPage === totalPages}
							>
								&gt;
							</button>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>

	<!-- Delete Confirmation Modal -->
	{#if showDeleteModal}
		<div
			class="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm"
			transition:fade
		>
			<div
				class="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full mx-4 text-center"
				transition:scale
			>
				<h3 class="font-display text-2xl text-[var(--color-deep-forest)] mb-2">Excluir Produto?</h3>
				<p class="text-gray-500 mb-6">Essa ação não pode ser desfeita.</p>
				<div class="flex gap-4 justify-center">
					<button
						on:click={closeDeleteModal}
						class="px-6 py-2 rounded-full border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors"
					>
						Cancelar
					</button>
					<form method="POST" action="?/delete" use:enhance>
						<input type="hidden" name="id" value={productToDelete} />
						<button
							type="submit"
							on:click={closeDeleteModal}
							class="px-6 py-2 rounded-full bg-red-500 text-white font-bold hover:bg-red-600 shadow-lg transition-colors"
						>
							Excluir
						</button>
					</form>
				</div>
			</div>
		</div>
	{/if}

	<!-- Image Preview Modal -->
	{#if showImageModal && selectedImage}
		<div
			class="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
			transition:fade
			on:click|self={closeImageModal}
		>
			<div class="relative max-w-5xl max-h-[90vh] w-full flex items-center justify-center">
				<button
					on:click={closeImageModal}
					class="absolute -top-12 right-0 text-white hover:text-[var(--color-sunset-orange)] transition-colors p-2"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-8 w-8"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
				<img
					src={selectedImage}
					alt="Visualização ampliada"
					class="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
					in:scale={{ start: 0.9, duration: 300 }}
				/>
			</div>
		</div>
	{/if}
{/if}

<style>
	:global(.admin-font) {
		--font-display: 'Helvetica', 'Helvetica Neue', Arial, sans-serif;
		font-family: 'Helvetica', 'Helvetica Neue', Arial, sans-serif;
	}

	:global(.admin-font h1),
	:global(.admin-font h2),
	:global(.admin-font h3),
	:global(.admin-font h4),
	:global(.admin-font h5),
	:global(.admin-font h6) {
		font-family: 'Helvetica', 'Helvetica Neue', Arial, sans-serif;
	}
</style>
