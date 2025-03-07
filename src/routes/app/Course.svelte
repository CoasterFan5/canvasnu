<script lang="ts">
	let {
		canvasDomain,
		course,
		index
	}: {
		canvasDomain: string;
		course: {
			courseId: number;
			nickname: string | null;
			name: string;
			externalId: number;
			color: string | null;
		};
		index: number;
	} = $props();

	let popOver: Popover;
	let colorPopOver: Popover;

	import Popover from '$lib/components/popover/Popover.svelte';
	import PopoverButton from '$lib/components/popover/PopoverButton.svelte';
	import { fade } from 'svelte/transition';
	import Nut from '~icons/ph/nut';
	import HideIcon from '~icons/ph/eye-slash';
	import ChangeColor from '~icons/ph/palette';
	import ChangeNickname from '~icons/ph/pencil-simple';
	import { enhance } from '$app/forms';
	import { createPromiseToast, handleToastPromiseWithFormAction } from '$lib/utils/toastManager';
	import Colorpicker from '$lib/components/colorpicker/Colorpicker.svelte';
	import { Color } from '$lib/components/colorpicker/Color';

	const settingsClick = (e: MouseEvent) => {
		e.preventDefault();
		popOver.propegateClick(e);
	};

	let colorInputElement: HTMLInputElement | undefined = $state();
	let colorSubmitElement: HTMLButtonElement | undefined = $state();

	let showingColorPicker = $state(false);

	const openColorPicker = (e: MouseEvent) => {
		showingColorPicker = true;
		e.preventDefault();
		colorPopOver.propegateClick(e);
	};

	const changeColor = (a: Color) => {
		if (colorInputElement && colorSubmitElement) {
			colorInputElement.value = a.getHslCode();
			colorSubmitElement.click();
		}
	};

	let c = new Color({ h: 0, s: 100, l: 50 });
</script>

<form
	hidden
	method="post"
	action="?/changeColor"
	use:enhance={() => {
		const toastManager = createPromiseToast('Updating...');
		return async ({ result, update }) => {
			handleToastPromiseWithFormAction(result, toastManager, {
				redirectsAreSuccess: true,
				redirectMessage: 'Success'
			});
			await update();
		};
	}}
>
	<input hidden name="color" bind:this={colorInputElement} />
	<input name="courseId" hidden value={course.courseId} />
	<button hidden type="submit" aria-label="hidden" bind:this={colorSubmitElement}></button>
</form>

<Popover bind:this={popOver}>
	<form
		class="hiddenForm"
		method="post"
		action="?/hideCourse"
		use:enhance={() => {
			const toastManager = createPromiseToast('Hiding...');
			return async ({ result, update }) => {
				handleToastPromiseWithFormAction(result, toastManager, {
					redirectsAreSuccess: true,
					redirectMessage: 'Hidden'
				});
				await update();
			};
		}}
	>
		<input name="courseId" hidden value={course.courseId} />
		<PopoverButton Icon={HideIcon}>Hide Course</PopoverButton>
	</form>
	<PopoverButton Icon={ChangeColor} onclick={openColorPicker}>Change Color</PopoverButton>
	<PopoverButton Icon={ChangeNickname}>Change Nickname</PopoverButton>
</Popover>

<Popover bind:this={colorPopOver}>
	{#if showingColorPicker}
		<Colorpicker input={changeColor} startColor={c} />
	{/if}
</Popover>

<a
	href="{canvasDomain}/courses/{course.externalId}"
	style="--courseColor: {course.color || '#ffffff'}"
	class="courseWrap"
	target="_blank"
	in:fade|global={{ delay: 25 * index, duration: 250 }}
>
	<div style="--c: {course.color};" class="courseInner">
		<div class="title">{course.nickname || course.name}</div>
		<div class="realName">{course.name}</div>
		<div class="courseButtons">
			<button class="nutButton" onclick={settingsClick}>
				<Nut />
			</button>
		</div>
	</div>
</a>

<style lang="scss">
	.courseWrap {
		color: var(--text);
		text-decoration: none;
		display: flex;
		flex-direction: column;
		border-radius: 0.5rem;
		margin-bottom: 0.5rem;
		width: 100%;
		background: var(--secondary);
		position: relative;
	}

	.courseInner {
		color: var(--text);
		text-decoration: none;
		display: flex;
		flex-direction: column;
		border-radius: 0.5rem;
		padding: 1rem;
		padding-bottom: 0.5rem;
		padding-right: 0.5rem;
		width: 100%;
		background-image: linear-gradient(
			135deg,
			var(--c) -20%,
			transparent 10%,
			transparent 90%,
			var(--c) 120%
		);
		position: relative;
	}

	.title {
		font-size: 1.2rem;
	}

	.realName {
		font-size: 0.8rem;
		opacity: 0.8;
	}

	.courseButtons {
		width: 100%;

		display: flex;
		flex-direction: row;
		justify-content: end;
	}

	.nutButton {
		all: unset;
		pointer-events: all;
		opacity: 0.8;
		padding: 0.5rem;

		&:hover {
			opacity: 1;
		}
	}

	.hiddenForm {
		margin: 0;
	}
</style>
