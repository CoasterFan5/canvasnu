<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	// Supports weights 100-900
	import '@fontsource-variable/work-sans';

	let { children } = $props();
</script>

<div class="wrap">
	{@render children()}

	<Navbar />
</div>

<style lang="scss">
	.wrap {
		width: 100%;
		height: 100vh;
		padding-top: 2rem;
		padding-bottom: 6rem;
		overflow-y: auto;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
