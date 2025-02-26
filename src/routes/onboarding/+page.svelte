<script lang="ts">
	import { enhance } from '$app/forms';
	import BasicInput from '$lib/components/inputs/BasicInput.svelte';
	import { createPromiseToast, handleToastPromiseWithFormAction } from '$lib/utils/toastManager';

	let submitButton: HTMLButtonElement;
</script>

<div class="wrap">
	<form
		class="container"
		autocomplete="off"
		method="post"
		action="?/login"
		use:enhance={() => {
			const toastManager = createPromiseToast('Updating...');
			return async ({ result, update }) => {
				handleToastPromiseWithFormAction(result, toastManager, {
					redirectsAreSuccess: true,
					redirectMessage: 'Logged In'
				});
				await update();
			};
		}}
	>
		<h2>Onboarding</h2>
		<BasicInput
			label={'Canvas URL:'}
			placeholder={'canvas.jmu.edu'}
			showEnter={false}
			secret={false}
			name="canvasUrl"
		/>
		<div class="spacer"></div>
		<BasicInput
			label={'Access Token'}
			placeholder={'*****'}
			name="accessToken"
			showEnter={true}
			secret={true}
		/>

		<button bind:this={submitButton} hidden>Submit</button>
	</form>
</div>

<style lang="scss">
	h2 {
		font-weight: 300;
	}

	.container {
		background: var(--secondary);
		padding: 2rem;
		border-radius: 0.5rem;
	}

	.wrap {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		width: 100%;
	}

	.spacer {
		width: 100%;
		height: 1px;
		padding: 0.25rem;
	}
</style>
