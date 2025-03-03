<script>
	import { Color } from '$lib/components/colorpicker/Color';
	import Colorpicker from '$lib/components/colorpicker/Colorpicker.svelte';

	let c = new Color({ h: 0, s: 100, l: 50 });
</script>

<Colorpicker bind:color={c} />
