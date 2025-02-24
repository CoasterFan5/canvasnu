<script lang="ts">
	let { children } = $props();

	import '@fontsource-variable/inter';

	import { Toaster } from 'svelte-french-toast';
</script>

<div class="wrap">
	<Toaster />
	{@render children()}
</div>

<style lang="scss">
	:global(body) {
		margin: 0;
		padding: 0;
		background: var(--background);
		color: var(--text);
		font-family: 'inter';

		--text: rgb(241, 241, 241);
		--text10: color-mix(in srgb, 10% var(--text), 90% transparent);
		--background: #242220;
		--tertiary: #1a1918;
		--primary: rgb(251, 135, 2);
		--primary10: color-mix(in srgb, 10% var(--primary), 90% transparent);
		--secondary: #111110;

		--accent: rgb(80, 80, 80);
		--accent75: color-mix(in srgb, 75% var(--accent), 25% transparent);
	}

	:global(*) {
		box-sizing: border-box;
	}

	:global(.coolBorder)::before {
		content: '';
		display: inline-block;
		border-radius: inherit;
		pointer-events: none;
		position: absolute;
		top: 0;
		left: 0;
		width: calc(100% - 2px);
		height: calc(100% - 2px);
		inset: 0;
		padding: 1px;
		background: conic-gradient(from -100deg, transparent 0deg, white 20deg, transparent 200deg);
		-webkit-mask:
			linear-gradient(#fff 0 0) content-box,
			linear-gradient(#fff 0 0);
		mask:
			linear-gradient(#fff 0 0) content-box,
			linear-gradient(#fff 0 0);
		-webkit-mask-composite: xor;
		mask-composite: exclude;
		opacity: 0.2;
	}

	:global(.coolBorderAlt)::before {
		content: '';
		display: inline-block;
		border-radius: inherit;
		pointer-events: none;
		position: absolute;
		top: 0;
		left: 0;
		width: calc(100% - 2px);
		height: calc(100% - 2px);
		inset: 0;
		padding: 1px;
		background: conic-gradient(from 100deg, transparent 0deg, white 20deg, transparent 200deg);
		-webkit-mask:
			linear-gradient(#fff 0 0) content-box,
			linear-gradient(#fff 0 0);
		mask:
			linear-gradient(#fff 0 0) content-box,
			linear-gradient(#fff 0 0);
		-webkit-mask-composite: xor;
		mask-composite: exclude;
		opacity: 0.2;
	}

	.wrap {
		height: 100vh;
		overflow-y: auto;
		width: 100%;
	}
</style>
