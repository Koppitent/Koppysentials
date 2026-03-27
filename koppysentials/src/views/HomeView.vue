<template>
	<div class="p-8 text-slate-300 mx-auto w-full max-w-2xl">
		<h1 class="text-2xl font-bold">Willkommen auf der Startseite!</h1>
		<p class="text-slate-400">Hier findest du eine Übersicht über die Funktionen der App.</p>
		<p class="text-slate-400">Nutze die Navigation, um zu den verschiedenen Tools zu gelangen.</p>
		<p class="text-slate-400">Viel Spaß beim Ausprobieren!</p>

		<br>

		<ul class="flex gap-4">
			<li>
				<LinkButton
					title="Kreditrechner"
					to="/kreditrechner"
					:icon="LucideCalculator"
				/>
			</li>
			<li>
				<LinkButton
					title="Autokauf-Rechner"
					to="/autokauf-rechner"
					:icon="LucideCar"
				/>
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import { LucideCalculator, LucideCar } from 'lucide-vue-next';
import LinkButton from '@/components/LinkButton.vue';
</script>