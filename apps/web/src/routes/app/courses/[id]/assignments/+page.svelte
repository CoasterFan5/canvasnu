<script lang="ts">
	import dayjs from 'dayjs';
	import type { PageData } from './$types';

	const {
		data
	}: {
		data: PageData;
	} = $props();
</script>

<div class="wrap">
	<div class="left">
		<div class="upcomingAssignments">
			<span class="header"><h4>Upcoming</h4></span>
			{#each data.upComingAssignments as assignment}
				<a
					class="assignment"
					target="_blank"
					href="https://{data.canvasDomain}{assignment.externalUrl}"
				>
					<div>{assignment.name}</div>
					<div>{dayjs(assignment.dueDate).format('MMM D')}</div>
				</a>
			{/each}
		</div>
		<div class="upcomingAssignments">
			<span class="header"><h4>All Assignments</h4></span>
			{#each data.allAssignments as assignment}
				<a
					class="assignment"
					target="_blank"
					href="https://{data.canvasDomain}{assignment.externalUrl}"
				>
					<div>{assignment.name}</div>
					<div>{dayjs(assignment.dueDate).format('MMM D')}</div>
				</a>
			{/each}
		</div>
	</div>
	<div class="right"></div>
</div>

<style lang="scss">
	.wrap {
		width: 100%;
		height: 100%;
		border-radius: 0.5rem;
	}

	.left {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.upcomingAssignments {
		background: var(--secondary);
		border-radius: 0.5rem;
		overflow: hidden;
	}

	.header {
		margin: 0;
		padding: 0.5rem;
		display: flex;
		opacity: 0.8;
		h4 {
			margin: 0;
			font-size: 0.8rem;
			font-weight: 400;
		}
	}

	.assignment {
		border-top: 2px solid var(--background);
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.5rem;
		color: var(--text);
		text-decoration: none;
	}
</style>
