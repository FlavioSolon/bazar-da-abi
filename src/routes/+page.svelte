<script>
	import Hero from '$lib/components/Hero.svelte';
	import About from '$lib/components/About.svelte';
	import Showcase from '$lib/components/Showcase.svelte';
	import Footer from '$lib/components/Footer.svelte';
</script>

<svelte:head>
	<title>Bazar da Abi | Desapegos com Propósito</title>
	<meta
		name="description"
		content="Bazar da Abi - Roupas, acessórios e muito mais. Todo valor arrecadado apoia missões."
	/>
</svelte:head>

<main class="w-full overflow-x-hidden">
	<Hero />
	<About />
	<Showcase />
	<Footer />
</main>
