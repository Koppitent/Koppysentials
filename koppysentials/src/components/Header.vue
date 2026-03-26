<template>
	<div class="flex justify-between items-center p-4 border-b border-[color:var(--color-border)]">
		<h1 class="text-lg font-bold text-[color:var(--color-heading)]">Koppysentials</h1>
		<nav>
			<ul class="flex gap-4">
				<li>
					<RouterLink
						to="/"
						class="text-sm text-[color:var(--color-text)] hover:text-[color:var(--color-text-highlight)] transition-colors"
					>
						Startseite
					</RouterLink>
				</li>
				<li>
					<RouterLink
						to="/kreditrechner"
						class="text-sm text-[color:var(--color-text)] hover:text-[color:var(--color-text-highlight)] transition-colors"
					>
						Kreditrechner
					</RouterLink>
				</li>
			</ul>
		</nav>
	</div>
</template>
	