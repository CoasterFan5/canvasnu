<script lang="ts">
	import { fly } from 'svelte/transition';

	let { children } = $props();

	let yPos = $state(0);
	let xPos = $state(0);

	let showing = $state(false);

	export const propegateClick = (e: MouseEvent) => {
		const t = e.currentTarget as HTMLHtmlElement;

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
			class="holder coolBorder"
			style="left: {xPos}px; top: {yPos}px;"
			in:fly={{
				duration: 150,
				y: 50
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
	}
	.holder {
		position: fixed;
		background: var(--tertiary);
		border-radius: 0.5rem;
	}
</style>
