<script lang="ts">
	import { quadInOut } from 'svelte/easing';
	import { innerHeight } from 'svelte/reactivity/window';
	import { fly } from 'svelte/transition';

	let { children } = $props();

	let yPos = $state(0);
	let xPos = $state(0);

	let width = $state(0);
	let height = $state(0);

	let initiatorWidth = $state(0);

	let showing = $state(false);

	export const propegateClick = (e: MouseEvent) => {
		const t = e.currentTarget as HTMLHtmlElement;
		initiatorWidth = t.clientWidth;
		xPos = t.getBoundingClientRect().left + Math.floor(t.clientWidth);
		yPos = t.getBoundingClientRect().top;
		showing = true;
	};

	const wrapClick = (e: MouseEvent) => {
		if (e.target == e.currentTarget) {
			showing = false;
		}
	};
</script>

{#if showing}
	<button class="wrap" onclick={wrapClick}>
		<div
			bind:clientWidth={width}
			bind:clientHeight={height}
			class="holder coolBorder"
			style="left:  {xPos - width - initiatorWidth}px; top: {yPos}px;"
			in:fly={{
				duration: 150,
				y: 50,
				easing: quadInOut
			}}
		>
			{@render children()}
		</div>
	</button>
{/if}

<style lang="ts">
	.wrap {
		position: fixed;
		width: 100%;
		height: 100%;
		left: 0px;
		top: 0px;
		background: transparent;
		outline: unset;
		border: unset;
		z-index: 250;
		backdrop-filter: blur(2px);
	}
	.holder {
		padding: 0.25rem;
		position: fixed;
		backdrop-filter: blur(5px);
		background: var(--background);
		border-radius: 0.5rem;
	}
</style>
