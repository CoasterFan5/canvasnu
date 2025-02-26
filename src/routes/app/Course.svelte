<script lang="ts">
	export let canvasDomain = '';
	export let course: {
		courseId: number;
		nickname: string | null;
		name: string;
		externalId: number;
		color: string | null;
	} = {
		courseId: 0,
		nickname: null,
		name: '',
		externalId: 0,
		color: null
	};
	export let index = 0;

	let popOver: Popover;

	import Popover from '$lib/components/popover/Popover.svelte';
	import PopoverButton from '$lib/components/popover/PopoverButton.svelte';
	import { fade } from 'svelte/transition';
	import Nut from '~icons/ph/nut';
	import HideIcon from '~icons/ph/eye-slash';
	import ChangeColor from '~icons/ph/palette';
	import ChangeNickname from '~icons/ph/pencil-simple';
	import { enhance } from '$app/forms';
	import { createPromiseToast, handleToastPromiseWithFormAction } from '$lib/utils/toastManager';

	const settingsClick = (e: MouseEvent) => {
		e.preventDefault();
		popOver.propegateClick(e);
	};
</script>

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
	<PopoverButton Icon={ChangeColor}>Change Color</PopoverButton>
	<PopoverButton Icon={ChangeNickname}>Change Nickname</PopoverButton>
</Popover>

<a
	href="https://{canvasDomain}/courses/{course.externalId}"
	style="--courseColor: {course.color || '#ffffff'}"
	class="courseWrap"
	target="_blank"
	in:fade|global={{ delay: 25 * index, duration: 250 }}
>
	<div class="title">{course.nickname || course.name}</div>
	<div class="realName">{course.name}</div>
	<div class="courseButtons">
		<button class="nutButton" on:click={settingsClick}>
			<Nut />
		</button>
	</div>
</a>

<style lang="scss">
	.courseWrap {
		color: var(--text);
		text-decoration: none;
		display: flex;
		flex-direction: column;
		border-radius: 0.5rem;
		padding: 1rem;
		padding-bottom: 0.5rem;
		padding-right: 0.5rem;
		margin-bottom: 0.5rem;
		width: 100%;
		background: var(--secondary);
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
