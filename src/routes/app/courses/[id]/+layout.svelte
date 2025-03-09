<script lang="ts">
	import type { Component, Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import BackArrow from '~icons/ph/caret-left';
	import DashboardIcon from '~icons/ph/squares-four';
	import AssignmentIcon from '~icons/ph/scroll';
	import DiscussionIcon from '~icons/ph/chat';
	import HomeIcon from '~icons/ph/house-simple';
	import FileIcon from '~icons/ph/file';
	import External from '~icons/ph/arrow-square-out';
	import type { SVGAttributes } from 'svelte/elements';
	const { data, children }: { data: LayoutData; children: Snippet } = $props();

	const toolbarButtons: {
		href: string;
		newTab: boolean;
		icon: Component<SVGAttributes<SVGSVGElement>>;
	}[] = [
		{
			href: `/app/courses/${data.course.courseId}`,
			newTab: false,
			icon: DashboardIcon
		},
		{
			href: `https://${data.canvasDomain}/courses/${data.course.externalId}`,
			newTab: true,
			icon: HomeIcon
		},
		{
			href: `https://${data.canvasDomain}/courses/${data.course.externalId}/assignments`,
			newTab: true,
			icon: AssignmentIcon
		},
		{
			href: `https://${data.canvasDomain}/courses/${data.course.externalId}/discussion_topics`,
			newTab: true,
			icon: DiscussionIcon
		},
		{
			href: `https://${data.canvasDomain}/courses/${data.course.externalId}/files`,
			newTab: true,
			icon: FileIcon
		},
		{
			href: `https://${data.canvasDomain}/courses/${data.course.externalId}`,
			newTab: true,
			icon: External
		}
	];
</script>

<div class="wrap">
	<div class="tools">
		<div class="left">
			<a class="backArrow" href="/app"><BackArrow /></a>
			<div class="courseName">
				<span class="nick">{data.course.nickname}</span>
				<span class="real">{data.course.name}</span>
			</div>
		</div>
		<div class="right">
			{#each toolbarButtons as b}
				<a class="toolbarButton" target={b.newTab ? '_blank' : '_top'} href={b.href}>
					<b.icon />
				</a>
			{/each}
		</div>
	</div>

	{@render children?.()}
</div>

<style lang="scss">
	.wrap {
		width: 100%;
		padding: 0% 20%;
		height: 100%;
	}

	.tools {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		width: 100%;
	}

	.right,
	.left {
		position: relative;
		display: flex;
		flex-direction: row;
		gap: 0.25rem;
		align-items: center;
	}

	.courseName {
		display: flex;
		flex-direction: column;

		.real {
			font-size: 0.8rem;
			opacity: 0.75;
		}
	}

	.backArrow {
		height: 100%;
		font-size: 1rem;
		color: var(--text);
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		left: -2rem;
	}

	.toolbarButton {
		padding: 0.25rem;
		background-image: url('/noiseImage.svg');
		outline: 1px solid rgba(255, 255, 255, 0.05);
		border-radius: 0.25rem;
		color: var(--text);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1rem;
	}
</style>
