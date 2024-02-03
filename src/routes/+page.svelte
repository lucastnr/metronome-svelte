<script lang="ts">
	import { onDestroy } from 'svelte';
	import ButtonController from '../components/ButtonController.svelte';
	import Play from 'svelte-material-icons/Play.svelte';
	import Pause from 'svelte-material-icons/Pause.svelte';

	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import metronomeMp3 from '../assets/metronome.mp3';
	import clickMp3 from '../assets/click.mp3';
	import { Sound } from 'svelte-sound';

	const metronomeSound = new Sound(metronomeMp3);
	const clickSound = new Sound(clickMp3, { volume: 0.07 });

	const storageKey = 'metronome';

	let metronome = (() => {
		if (!browser) return 0;
		const cached = $page.url.searchParams.get(storageKey) || '';
		return isNaN(+cached) ? 0 : +cached;
	})();
	let playing = false;

	// Deal with caching the new metronome value
	$: (() => {
		if (!browser) return;
		const cache = metronome.toString();
		$page.url.searchParams.set(storageKey, cache);
		goto($page.url);
	})();

	let intervalId: null | number = null;
	$: (async () => {
		if (!browser) return;

		if (intervalId) {
			clearInterval(intervalId);
			intervalId = null;
		} else if (playing) {
			// Start the metronome sound if wasn't playing before
			metronomeSound.play();
		}
		if (playing) {
			const interval = 60000 / metronome;
			intervalId = setInterval(async () => {
				metronomeSound.play();
			}, interval);
			return;
		}
	})();

	function increment() {
		clickSound.play();
		metronome++;
	}

	function decrement() {
		clickSound.play();
		metronome = Math.max(metronome - 1, 0);
	}
</script>

<div class="flex flex-col w-full h-screen items-center justify-center gap-2">
	<div class="flex flex-row items-center justify-center gap-10">
		<ButtonController class="shrink-0" onClick={decrement}>-</ButtonController>
		<p>{metronome}</p>
		<ButtonController class="shrink-0" onClick={increment}>+</ButtonController>
	</div>
	<ButtonController onClick={() => (playing = !playing)}>
		{#if playing}
			<Pause />
		{:else}
			<Play />
		{/if}
	</ButtonController>
</div>
