<script lang="ts">
	import { fade } from 'svelte/transition';
	import dayjs from 'dayjs';
	import RelativeTime from 'dayjs/plugin/relativeTime';
	let { data } = $props();

	dayjs.extend(RelativeTime);

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
			<div class="wrapLeft coolBorder">
				<h3>Courses</h3>
				{#await data.courses}
					loading...
				{:then courseData}
					{#if courseData}
						{#each courseData as course, i}
							<a
								href="https://{data.canvasDomain}/courses/{course.id}"
								style="--courseColor: {course.course_color || '#ffffff'}"
								class="courseWrap"
								target="_blank"
								in:fade|global={{ delay: 10 * i, duration: 250 }}
							>
								{course.name}
							</a>
						{/each}
					{:else}
						Could not load course data.
					{/if}
				{/await}
			</div>
		</div>
		<div class="right">
			<div class="rightWrap">
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
								<div class="upcomingWrap coolBorder">
									<a
										href="https://{data.canvasDomain}{plannerItem.html_url}"
										class="upcoming"
										target="_blank"
										in:fade|global={{ delay: 10 * i, duration: 250 }}
									>
										<span class="title">{plannerItem.plannable.title}</span>
										<span class="dueIn">Due {dayjs().to(dayjs(plannerItem.plannable.due_at))}</span>
									</a>
								</div>
							{/each}
						{/if}
					{/await}
				</div>
			</div>
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

	.wrapLeft {
		display: flex;
		flex-direction: column;
		align-items: center;
		background: var(--secondary);
		border-radius: 0.5rem;
		position: relative;
		padding: 2rem;
	}

	.right {
		width: 100%;
		height: 100%;
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

	.rightWrap {
		border-radius: 0.5rem;
		background: transparent;
		position: relative;
		height: 100%;
		display: flex;
		flex-direction: column;
		overflow-y: visible;
	}

	.lightText {
		opacity: 0.7;
		font-weight: 300;
	}

	.courseWrap {
		color: var(--text);
		text-decoration: none;
		display: flex;
		border-radius: 0.5rem;
		padding: 0.5rem;
		margin-bottom: 0.5rem;
		width: 100%;
	}

	.upcomingWrap {
		padding: 0.5rem;
		width: 100%;
		background: var(--secondary);
		overflow-y: visible;
		border-radius: 0.25rem;
		position: relative;
	}

	.upcoming {
		width: 100%;
		color: var(--text75);
		text-decoration: none;
		display: flex;
		flex-direction: column;
	}

	.title {
		overflow-x: hidden;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.toDo {
		overflow-y: auto;
		scrollbar-width: none;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
</style>
