<script lang="ts">
	import type { Component, Snippet } from 'svelte';
	import type { MouseEventHandler, SvelteHTMLElements } from 'svelte/elements';

	let {
		children,
		Icon,
		onclick
	}: {
		children: Snippet;
		Icon: Component<SvelteHTMLElements['svg']>;
		onclick?: MouseEventHandler<HTMLButtonElement>;
	} = $props();
</script>

<button class="popOverButton" {onclick}>
	<div class="icon">
		<Icon />
	</div>
	{@render children()}
</button>

<style lang="scss">
	.popOverButton {
		width: 100%;
		padding: 0.25rem 0.5rem;
		display: flex;
		flex-direction: row;
		gap: 0.5rem;
		font-size: 1rem;
		background-color: unset;
		color: white;
		outline: unset;
		border: unset;
		border-radius: 0.5rem;
		cursor: pointer;
		color: var(--text);

		&:hover {
			background: var(--primary10);
			cursor: point;
		}
	}
</style>
