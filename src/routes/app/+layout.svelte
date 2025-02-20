<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';

	let { children } = $props();
</script>

<div class="wrap">
	{@render children()}

	<Navbar />
</div>

<style lang="scss">
	:global(body) {
		margin: 0;
		padding: 0;
		background: var(--background);
		color: var(--text);

		--text: rgb(241, 241, 241);
		--text10: color-mix(in srgb, 10% var(--text), 90% transparent);
		--background: rgb(36, 31, 24);
		--primary: rgb(251, 135, 2);
		--primary10: color-mix(in srgb, 10% var(--primary), 90% transparent);
		--secondary: rgb(0, 0, 0);

		--accent: rgb(80, 80, 80);
		--accent75: color-mix(in srgb, 75% var(--accent), 25% transparent);
	}

	:global(*) {
		box-sizing: border-box;
	}

	.wrap {
		width: 100%;
		height: 100vh;
		overflow-y: auto;
	}
</style>
