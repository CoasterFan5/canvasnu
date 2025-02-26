<script lang="ts">
	let element = $state();
	import * as echarts from 'echarts';
	import { onDestroy, onMount } from 'svelte';

	let {
		options
	}: {
		options: echarts.EChartsOption;
	} = $props();

	let c: echarts.ECharts;

	onMount(() => {
		if (element) {
			c = echarts.init(element as HTMLDivElement);
			c.setOption(options);
		}
	});

	onDestroy(() => {
		if (c) {
			c.dispose();
		}
	});
</script>

<div bind:this={element}></div>

<style lang="scss">
	div {
		width: 100%;
		height: 100%;
	}
</style>
