<script lang="ts">
	import { fade } from 'svelte/transition';

	let { data } = $props();

	let plannerList = $derived.by(async () => {
		const plannerData = await data.planner;
		if (!plannerData) {
			return [];
		}
		return plannerData.filter((item) => {
			const hasOverride = item.planner_override;
			const hasSubmission =
				item.submissions && (item.submissions.graded || item.submissions.submitted);

			return !hasOverride && !hasSubmission;
		});
	});
</script>

<div class="wrap">
	<div class="header">
		<h2 class="greeting">Hello, {data.firstName}</h2>
		<h3>Class in 3 hours</h3>
	</div>

	<div class="twoPaneWrap">
		<div class="left">
			<div class="courseRecap coolBorder">
				<div class="upper">
					<div class="chart">chart</div>
					<div class="text">
						<span>
							5 <span class="lightText">Assingments overdue</span>
						</span>
						<span>
							7 <span class="lightText">Assingments upcoming</span>
						</span>
						<span>
							21 <span class="lightText">Assingments due eventually</span>
						</span>
					</div>
				</div>
				<div class="toDo">
					{#await plannerList}
						Loading planner...
					{:then planner}
						{#if planner}
							{#each planner as plannerItem, i}
								<div class="upcomingWrap">
									<a
										href="https://{data.canvasDomain}{plannerItem.html_url}"
										class="upcoming"
										target="_blank"
										in:fade|global={{ delay: 10 * i, duration: 250 }}
									>
										{plannerItem.plannable.title}
									</a>
								</div>
							{/each}
						{/if}
					{/await}
				</div>
			</div>
		</div>
		<div class="right">
			<h3>Courses</h3>
			{#await data.courses}
				loading...
			{:then courseData}
				{#if courseData}
					{#each courseData as course, i}
						<div
							style="--courseColor: {course.course_color || '#ffffff'}"
							class="courseWrap"
							in:fade|global={{ delay: 10 * i, duration: 250 }}
						>
							{course.name}
						</div>
					{/each}
				{:else}
					Could not load course data.
				{/if}
			{/await}
		</div>
	</div>
</div>

<style lang="scss">
	.twoPaneWrap {
		display: flex;
		flex-direction: row;
		gap: 1rem;
		height: 100%;
		width: 100%;
	}

	.courses {
		width: 100%;
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.left {
		width: 100%;
		height: 100%;
	}

	.right {
		width: 100%;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		background: var(--secondary);
		height: 100%;
		border-radius: 1rem;
	}
	.greeting {
		font-weight: 400;
	}

	h3 {
		font-weight: 300;
		opacity: 0.8;
	}

	.wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 80%;
		height: 100%;
	}

	.header {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		width: 100%;
	}

	.courseRecap {
		border-radius: 0.5rem;
		background: transparent;
		position: relative;
		background: var(--secondary);
		padding: 0.5rem;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.lightText {
		opacity: 0.7;
		font-weight: 300;
	}

	.courseWrap {
		display: flex;
		border-left: 1px solid var(--courseColor);
		padding: 0.25rem;
		margin-bottom: 0.5rem;
	}

	.upcomingWrap {
		padding: 0.25rem;
		width: 100%;
		background: var(--tertiary);
		border-bottom: 1px solid rgba(255, 255, 255, 0.05);
	}

	.upcoming {
		display: inline-block;
		color: var(--text75);
		text-decoration: none;
		width: 100%;

		padding: 0.5rem;
		border-radius: 0.5rem;
		overflow-x: hidden;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 30rem;
	}

	.toDo {
		overflow-y: auto;
		scrollbar-width: none;
		border-radius: 0.5rem;
	}
</style>
