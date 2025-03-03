<script lang="ts">
	import { Color } from './Color';
	import ConfirmSymbol from '~icons/ph/check';
	let {
		startColor = new Color({ h: 0, s: 0, l: 0 }),
		input
	}: {
		startColor?: Color;
		input?: (color: Color) => void;
	} = $props();

	let color = $state(startColor);

	import type { FormEventHandler } from 'svelte/elements';

	let sliderTimeout = 0;

	const sliderInput: FormEventHandler<HTMLInputElement> = (e) => {
		if (sliderTimeout) {
			return;
		}
		sliderTimeout = window.setTimeout(() => {
			color.setH(parseInt((e.target as HTMLInputElement)?.value || '0'));
			color = color.clone();
			sliderTimeout = 0;
		}, 100);
	};

	let mouseDown = false;
	let selectionGrid: HTMLDivElement | undefined = $state();
	let colorPreviewElement: HTMLDivElement | undefined = $state();

	const mouseUp = () => {
		mouseDown = false;
	};

	const selectionGridDown = () => {
		if (selectionGrid) {
			startX = selectionGrid.getBoundingClientRect().x;
			width = selectionGrid.clientWidth;

			startY = selectionGrid.getBoundingClientRect().y;
			height = selectionGrid.clientHeight;
			gridInit = true;
		}
		mouseDown = true;
	};

	let dotPos: {
		x: number;
		y: number;
	} = $state({
		x: 0,
		y: 1
	});

	let timeout = 0;

	let startX = 0;
	let startY = 0;
	let width = 0;
	let height = 0;
	let gridInit = false;

	$effect(() => {
		if (colorPreviewElement) {
			colorPreviewElement.style.background = color.getHslCode();
		}
	});

	const selectionGridMove = (e: MouseEvent) => {
		if (mouseDown && gridInit) {
			if (timeout) {
				return;
			}

			timeout = window.setTimeout(() => {
				let xPercent = Math.min(Math.max(e.clientX - startX, 0), width) / width;
				let yPercent = 1 - Math.min(Math.max(e.clientY - startY, 0), height) / height;

				dotPos = {
					x: xPercent,
					y: 1 - yPercent
				};

				timeout = 0;
				color.setS(xPercent * 100);
				color.setL((yPercent - 0.5 * xPercent * yPercent) * 100);
				color = color.clone();
			}, 16);
		}
	};

	const dispatchInput = () => {
		if (input) {
			input(color);
		}
	};
</script>

<svelte:document on:mouseup={mouseUp} onmousemove={selectionGridMove} />

<div class="colorPicker">
	<div
		style="--c: {color.getClosestFullColor().getHslCode()}"
		class="selectionGrid"
		bind:this={selectionGrid}
		onmousedown={selectionGridDown}
		role="none"
	>
		{#if selectionGrid}
			<div
				class="dot"
				style="left: {dotPos.x * selectionGrid.clientWidth}px; top: {dotPos.y *
					selectionGrid.clientHeight}px"
			></div>
		{/if}
	</div>
	<input class="rangeSelector" type="range" step="1" min={0} max={359} oninput={sliderInput} />
	<div class="finalize">
		<div bind:this={colorPreviewElement} class="colorPreview"></div>
		<button onclick={dispatchInput}>
			<ConfirmSymbol />
		</button>
	</div>
</div>

<style lang="scss">
	.colorPicker {
		display: flex;
		flex-direction: column;
		padding: 1rem;
		border-radius: 0.5rem;
		position: relative;
		gap: 0.5rem;
	}

	.selectionGrid {
		width: 100%;
		aspect-ratio: 1/1;
		background: linear-gradient(90deg, white, var(--c));
		position: relative;

		&::after {
			content: '';
			position: absolute;
			left: 0px;
			top: 0px;
			height: 100%;
			width: 100%;
			background: linear-gradient(0deg, black, transparent);
		}
	}

	.rangeSelector {
		all: unset;
		background: linear-gradient(
			to right,
			#f00 0%,
			#ff0 17%,
			#0f0 33%,
			#0ff 50%,
			#00f 66%,
			#f0f 83%,
			#f00 100%
		);
		border-radius: 0.25rem;
	}

	.dot {
		border-radius: 100%;
		height: 14px;
		width: 14px;
		position: absolute;
		background: transparent;
		border: 2px solid white;
		z-index: 1;
		transform: translate(-50%, -50%);

		&::after {
			content: '';
			position: absolute;
			width: 6px;
			height: 6px;
			left: 0px;
			top: 0px;
			border-radius: 100%;
			border: 2px solid black;
		}
	}

	.finalize {
		display: flex;
		flex-direction: row;
		gap: 0.25rem;
		.colorPreview {
			background: var(--c);
			width: 100%;
			border-radius: 0.25rem;
		}

		button {
			all: unset;
			display: flex;
			align-items: center;
			justify-content: center;
			box-sizing: border-box;
			border-radius: 100%;
			opacity: 0.75;
			cursor: pointer;
			transition: all cubic-bezier(0.455, 0.03, 0.515, 0.955) 0.25s;
			color: var(--text);

			&:hover {
				opacity: 1;
			}
		}
	}
</style>
