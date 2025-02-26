<script lang="ts">
	import { fade } from 'svelte/transition';
	import dayjs from 'dayjs';
	import RelativeTime from 'dayjs/plugin/relativeTime';
	import Course from './Course.svelte';
	let { data } = $props();
	import { type EChartsOption } from 'echarts';
	import AssignmentChart from './AssignmentChart.svelte';

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

	const dataAssignmentOptions = [
		{
			courseName: 'Math',
			assignments: 2,
			color: '#ffffff'
		},
		{
			courseName: 'Science',
			assignments: 3
		},
		{
			courseName: 'History',
			assignments: 5
		},
		{
			courseName: 'English',
			assignments: 1
		}
	];
	const chartOptions: EChartsOption = {
		tooltip: {
			trigger: 'item'
		},
		legend: {
			show: false,
			top: '5%',
			right: -50,
			orient: 'vertical'
		},
		series: [
			{
				name: '7 Day Outlook',
				type: 'pie',
				radius: ['70%', '90%'],
				avoidLabelOverlap: false,
				itemStyle: {
					borderRadius: 10,
					borderColor: '#111110',
					borderWidth: 10
				},
				label: {
					show: false,
					position: 'center'
				},
				emphasis: {
					label: {
						show: true,
						fontSize: 20,
						fontWeight: 'bold',
						color: 'white'
					}
				},
				labelLine: {
					show: false
				},
				data: dataAssignmentOptions.map((item) => {
					return {
						value: item.assignments,
						name: item.courseName,
						itemStyle: {
							color: item.color || 'white'
						}
					};
				})
			}
		]
	};
</script>

<div class="wrap">
	<div class="header">
		<h2 class="greeting">Hello, {data.firstName}</h2>
		<h3>Class in 3 hours</h3>
	</div>

	<div class="twoPaneWrap">
		<div class="left">
			<div class="assignmentSummaryWrap">
				<div class="upper">
					<div class="chartWrap">
						<div class="chart"><AssignmentChart options={chartOptions} /></div>
					</div>
				</div>
				<div class="toDoWrap">
					<div class="toDo">
						{#await plannerList}
							<div class="upcomingWrap" class:notFirst={false} class:notLast={true}>
								<a
									href="/#"
									class="upcoming"
									target="_blank"
									in:fade|global={{ delay: 0, duration: 250 }}
								>
									<span class="title"
										>This is a really long title for loading purposes to see if htis changes the
										layout shift</span
									>
									<span class="dueIn">Loading...</span>
								</a>
							</div>
						{:then planner}
							{#if planner}
								{#each planner as plannerItem, i}
									<div
										class="upcomingWrap"
										class:notFirst={i != 0}
										class:notLast={i != planner.length - 1}
									>
										<a
											href="https://{data.canvasDomain}{plannerItem.html_url}"
											class="upcoming"
											target="_blank"
											in:fade|global={{ delay: 10 * i, duration: 250 }}
										>
											<span class="title">{plannerItem.plannable.title}</span>
											<span class="dueIn"
												>Due {dayjs().to(dayjs(plannerItem.plannable.due_at))}</span
											>
										</a>
									</div>
								{/each}
							{/if}
						{/await}
					</div>
				</div>
			</div>
		</div>
		<div class="right">
			<div class="rightWrap">
				<div>
					{#await data.courses}
						loading...
					{:then courseData}
						{#if courseData}
							{#each courseData as course, i}
								<Course index={i} {course} canvasDomain={data.canvasDomain} />
							{/each}
						{:else}
							Could not load course data.
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
		width: 50%;
		height: 100%;
		flex-grow: 1;
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

	.assignmentSummaryWrap {
		height: 100%;
		width: 100%;
		background: var(--secondary);
		padding: 1rem;
		border-radius: 0.5rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-height: 80vh;
		overflow-x: hidden;
	}

	.right {
		width: 50%;
		height: 100%;
		flex-grow: 1;
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
		overflow-y: hidden;
	}

	.lightText {
		opacity: 0.7;
		font-weight: 300;
	}

	.title {
		overflow-x: hidden;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.toDoWrap {
		overflow-y: scroll;
		scrollbar-width: none;
		background-color: var(--tertiary);
		border-radius: 0.5rem;
		border-top: 1px solid black;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.toDo {
		scrollbar-width: none;
		display: flex;
		background-image: url('/noiseImage.svg');
		background-color: var(--tertiary);
		padding: 0.5rem;
		border-radius: 0.5rem;
		flex-direction: column;
	}

	.upcomingWrap {
		padding: 0.5rem;
		box-sizing: border-box;
		width: 100%;
		overflow-y: hidden;
		position: relative;

		&.notLast {
			border-bottom: 1px solid black;
		}

		&.notFirst {
			border-top: 1px solid rgba(255, 255, 255, 0.05);
		}
	}

	.upcoming {
		width: 100%;
		color: var(--text75);
		text-decoration: none;
		display: flex;
		flex-direction: column;
		font-size: 0.9rem;
		overflow-x: hidden;
		max-width: 90%;
	}

	.chartWrap {
		aspect-ratio: 2/1;
	}

	.chart {
		height: 100%;
		aspect-ratio: 1/1;
	}
</style>
