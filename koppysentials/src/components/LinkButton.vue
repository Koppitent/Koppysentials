<template>
	<RouterLink
		:to="to ? to : '#'"
		class="inline-flex items-center gap-2 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-background-soft)] px-4 py-2 font-medium text-[color:var(--color-heading)] transition-colors hover:border-[color:var(--color-border-hover)] hover:bg-[color:var(--color-background-mute)]"
	>
		<component :is="icon" v-if="icon" class="h-4 w-4" />
		<span>{{ title }}</span>
	</RouterLink>
</template>

<script setup lang="ts">
import type { Component } from 'vue';
import { RouterLink } from 'vue-router';

defineProps<{
	title: string;
	to?: string;
	icon?: Component;
}>();
</script>