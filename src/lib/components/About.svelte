<script>
	import bibiCrias from '$lib/assets/bibi_crias.jpeg';
	// About Section
</script>

<section class="py-20 px-6 bg-[var(--color-navy-blue)] text-[var(--color-cream)]">
	<div class="container mx-auto flex flex-col md:flex-row items-center gap-12">
		<!-- Image Column -->
		<div class="w-full md:w-1/2">
			<div class="relative transform rotate-2 hover:rotate-0 transition duration-500">
				<div
					class="absolute inset-0 border-2 border-[var(--color-sunset-orange)] rounded-lg transform translate-x-4 translate-y-4"
				></div>
				<img
					src={bibiCrias}
					alt="Abi com crianças"
					class="relative rounded-lg shadow-2xl w-full object-cover aspect-[3/4]"
				/>
			</div>
		</div>

		<!-- Text Column -->
		<div class="w-full md:w-1/2 space-y-6">
			<h2 class="font-display text-5xl text-[var(--color-sunset-orange)]">Sobre a Abi</h2>
			<p class="font-body text-lg leading-relaxed opacity-90">
				Design & Missio Dei. Acredito que cada peça de roupa carrega uma história, e agora elas
				estão prontas para viver novas aventuras com você.
			</p>
			<p class="font-body text-lg leading-relaxed opacity-90">
				Todo o valor arrecadado neste bazar tem um propósito maior: apoiar missões e levar amor a
				quem precisa. Ao levar uma peça, você também está fazendo parte dessa jornada.
			</p>

			<!-- Signature or Quote -->
			<div class="pt-4">
				<p class="font-display text-3xl opacity-80">"Credo ut intelligan, intelligo ut credan"</p>
			</div>
		</div>
	</div>
</section>
