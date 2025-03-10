<script lang="ts">
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
			<h4>Upcoming</h4>
			{#each data.upComingAssignments as assignment}
				<a
					class="assignment"
					target="_blank"
					href="https://{data.canvasDomain}{assignment.externalUrl}"
				>
					{assignment.name}</a
				>
			{/each}
		</div>
		<div class="allAssignments">
			<h4>All Assignments</h4>
			{#each data.allAssignments as assignment}
				<a class="assignment" href="##">{assignment.name}</a>
			{/each}
		</div>
	</div>
	<div class="right"></div>
</div>

<style lang="scss">
	.wrap {
		width: 100%;
		height: 100%;
		background: var(--secondary);
		border-radius: 0.5rem;
		padding: 1rem;
	}

	h4 {
		font-weight: 500;
		font-size: 1.1rem;
	}

	.assignment {
		width: 100%;
		display: flex;
		background: var(--secondary);
		padding: 0.5rem;
		border-radius: 0.5rem;
	}
</style>
