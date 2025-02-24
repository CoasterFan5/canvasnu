<script lang="ts">
	import { fade } from 'svelte/transition';

	let { data } = $props();
</script>

<div class="wrap">
	<div class="header">
		<h2 class="greeting">Hello, {data.firstName}</h2>
		<h3>Class in 3 hours</h3>
	</div>

	<div class="twoPaneWrap">
		<div class="courses">
			<div class="courseRecap coolBorder">
				<div class="chart">chart</div>
				<div class="text">
					<span>
						5 <span class="lightText">Assingments due today</span>
					</span>
					<span>
						7 <span class="lightText">Assingments due in the next 3 days</span>
					</span>
					<span>
						21 <span class="lightText">Assingments due in the next 7 days</span>
					</span>
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
							in:fade|global={{ delay: 15 * i, duration: 250 }}
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
</style>
