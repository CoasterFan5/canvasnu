<script lang="ts">
	import { Color } from './Color';
	import ConfirmSymbol from '~icons/ph/check';
	let {
		color = $bindable(),
		input
	}: {
		color: Color;
		input: (color: Color) => void;
	} = $props();
	import type { FormEventHandler } from 'svelte/elements';

	const createSwatches = (newColor: Color) => {
		return [
			newColor.getNewWithH(0),
			newColor.getNewWithH(33),
			newColor.getNewWithH(55),
			newColor.getNewWithH(137),
			newColor.getNewWithH(183),
			newColor.getNewWithH(274),
			newColor.getNewWithH(331)
		];
	};

	let swatches = $state(createSwatches(color));

	const sliderInput: FormEventHandler<HTMLInputElement> = (e) => {
		console.log(e);
		color.setH(parseInt((e.currentTarget as HTMLInputElement).value || '0'));
		color = color;
	};

	let mouseDown = false;
	let selectionGrid: HTMLDivElement | undefined = $state();

	const mouseUp = () => {
		mouseDown = false;
	};

	const selectionGridDown = () => {
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

	const selectionGridMove = (e: MouseEvent) => {
		if (mouseDown && selectionGrid) {
			const startX = selectionGrid.getBoundingClientRect().x;
			const width = selectionGrid.clientWidth;

			const startY = selectionGrid.getBoundingClientRect().y;
			const height = selectionGrid.clientHeight;

			let xPercent = Math.min(Math.max(e.clientX - startX, 0), width) / width;
			let yPercent = 1 - Math.min(Math.max(e.clientY - startY, 0), height) / height;

			dotPos = {
				x: xPercent,
				y: 1 - yPercent
			};

			if (timeout) {
				return;
			}

			timeout = window.setTimeout(() => {
				console.log(xPercent, yPercent);

				color.setS(xPercent * 100);
				color.setL((yPercent - 0.5 * xPercent * yPercent) * 100);
				color = color;
				swatches = createSwatches(color);

				timeout = 0;
			}, 100);
		}
	};

	const dispatchInput = () => {
		input(color);
	};
</script>

<svelte:document on:mouseup={mouseUp} onmousemove={selectionGridMove} />

<div class="colorPicker coolBorder">
	<div class="swatches">
		{#each swatches as swatch}
			<button
				style="--c: {swatch.getHslCode()}"
				aria-label="Color Swatch"
				class="swatch"
				onclick={() => {
					color = swatch;
				}}
			>
			</button>
		{/each}
	</div>
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
		{#key color}
			<div style="--c: {color.getHslCode()}" class="colorPreview"></div>
		{/key}
		<button onclick={dispatchInput}>
			<ConfirmSymbol />
		</button>
	</div>
</div>

<style lang="scss">
	.colorPicker {
		display: flex;
		flex-direction: column;
		background: var(--tertiary);
		padding: 1rem;
		border-radius: 0.5rem;
		position: relative;
		gap: 0.5rem;
	}

	.swatches {
		display: flex;
		flex-direction: row;
		gap: 0.25rem;
	}

	.swatch {
		all: unset;
		cursor: pointer;
		background: var(--c);
		height: 1.5rem;
		width: 1.5rem;
		border-radius: 100%;
		transition: all cubic-bezier(0.455, 0.03, 0.515, 0.955) 0.25s;
		&:hover {
			scale: 1.25;
		}
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

			&:hover {
				opacity: 1;
			}
		}
	}
</style>
