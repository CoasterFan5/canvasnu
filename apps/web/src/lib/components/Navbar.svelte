<script lang="ts">
	import HomeIcon from '~icons/ph/house';
	import CalendarIcon from '~icons/ph/calendar';
	import MailIcon from '~icons/ph/tray';
	import SettingsIcon from '~icons/ph/nut';

	import { page } from '$app/state';

	console.log(page.route.id);
</script>

<nav class="nav">
	<a href="/app" class="button" class:active={page.route.id == '/app'}>
		<HomeIcon />
	</a>
	<a href="/app/calendar" class="button" class:active={page.route.id == '/app/calendar'}>
		<CalendarIcon />
	</a>
	<a href="/app/inbox" class="button" class:active={page.route.id == '/app/inbox'}>
		<MailIcon />
	</a>
	<a href="/app/settings" class="button" class:active={page.route.id == '/app/settings'}>
		<SettingsIcon />
	</a>
</nav>

<style lang="scss">
	.nav {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		padding: 0.5rem;
		gap: 0.75rem;
		font-size: 1rem;
		position: fixed;
		backdrop-filter: blur(10px);
		left: 50%;
		transform: translateX(-50%);
		bottom: 0;
		margin-bottom: 1.5rem;
		border-radius: 10rem;
		box-shadow:
			rgba(0, 0, 0, 0.24) 4px 16px 36px 0px,
			rgba(255, 255, 255, 0.32) 0.5px 0.5px 0.5px 0px inset,
			rgba(255, 255, 255, 0.05) 0.5px -0.5px 0.5px 0px inset;
	}

	.button {
		all: unset;
		box-sizing: border-box;
		aspect-ratio: 1/1;
		color: var(--text);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem;
		border-radius: 100%;
		font-size: 1.2rem;
		cursor: pointer;
		transition: all cubic-bezier(0.455, 0.03, 0.515, 0.955) 0.25s;

		&:hover {
			opacity: 0.75;
		}

		&.active {
			background: var(--accent);
			box-shadow:
				rgba(255, 255, 255, 0.32) 0.5px 0.5px 0.5px 0px inset,
				rgba(255, 255, 255, 0.05) 0.5px -0.5px 0.5px 0px inset;
		}
	}
</style>
