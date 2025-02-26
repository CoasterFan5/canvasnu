<script lang="ts">
	let {
		label,
		placeholder,
		showEnter,
		secret,
		name,
		onClick
	}: {
		label: string;
		placeholder: string;
		showEnter: boolean;
		secret: boolean;
		name: string;
		onClick?: (e: KeyboardEvent) => void;
	} = $props();

	import EnterIcon from '~icons/ph/arrow-u-down-left';
</script>

<label>
	<span class="text">{label}</span>
	<div class="wrap">
		{#if secret}
			<input {placeholder} {name} type="password" onkeypress={onClick} />
		{:else}
			<input {placeholder} {name} onkeypress={onClick} />
		{/if}
		{#if showEnter}
			<div class="enterIcon">
				<EnterIcon />
			</div>
		{/if}
	</div>
</label>

<style lang="scss">
	.wrap {
		border-radius: 0.5rem;
		position: relative;
		display: flex;
		border-top: 1px solid black;
		border-bottom: 1px solid rgba(255, 255, 255, 0.05);
		background-color: var(--tertiary);
		align-items: center;
	}

	input {
		outline: 0px;
		border: 0px;
		width: 100%;
		height: 100%;
		padding: 0.75rem;
		border-radius: 0.5rem;
		background: transparent;
		color: var(--text);
		font-size: 1.1rem;
	}

	.text {
		font-size: 0.8rem;
		margin-bottom: 0.5rem;
		font-weight: 300;
		padding-left: 0.5rem;
	}

	.enterIcon {
		height: 100%;
		aspect-ratio: 1/1;
		display: flex;
		align-items: center;
		justify-content: center;
		padding-right: 1rem;
	}
</style>
