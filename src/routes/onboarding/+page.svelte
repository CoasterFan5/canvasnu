<script>
	import BasicInput from '$lib/components/inputs/BasicInput.svelte';
</script>

<div class="wrap">
	<form class="container" autocomplete="off">
		<h2>Onboarding</h2>
		<BasicInput label={'Canvas URL:'} placeholder={'canvas.jmu.edu'} showEnter={false} />
		<div class="spacer"></div>
		<BasicInput label={'Access Token'} placeholder={'*****'} showEnter={true} secret={true} />
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
