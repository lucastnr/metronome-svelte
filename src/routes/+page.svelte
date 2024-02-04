<script lang="ts">
	import ButtonController from '../components/ButtonController.svelte';
	import Play from 'svelte-material-icons/Play.svelte';
	import Pause from 'svelte-material-icons/Pause.svelte';

	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import metronomeMp3 from '../assets/metronome.mp3';
	import clickMp3 from '../assets/click.mp3';
	import { Sound } from 'svelte-sound';
	import { writable, get } from 'svelte/store';

	const metronomeSound = new Sound(metronomeMp3);
	const clickSound = new Sound(clickMp3, { volume: 0.07 });

	const storageKey = 'metronome';
	const defaultMetronome = 60;

	function sleep(ms: number) {
		return new Promise((r) => setTimeout(r, ms));
	}

	function getInitialMetronome() {
		if (!browser) return defaultMetronome;
		const cached = $page.url.searchParams.get(storageKey) || '';
		return isNaN(+cached)
			? defaultMetronome
			: Math.max(+cached, defaultMetronome);
	}

	const metronome = writable(getInitialMetronome());
	const playing = writable(false);

	playing.subscribe(async () => {
		let metronomeChanged = true;
		metronome.subscribe(() => metronomeChanged = true);

		while (get(playing)) {
			if (metronomeChanged) await sleep(800);
			metronomeChanged = false;

			metronomeSound.play();
			const interval = 60000 / get(metronome);
			await sleep(interval);
		}
	});

	// Deal with caching the new metronome value
	$: (() => {
		if (!browser || !$metronome) return;

		const cache = $metronome.toString();
		$page.url.searchParams.set(storageKey, cache);
		goto($page.url);
	})();

	function increment() {
		clickSound.play();
		$metronome++;
	}

	function decrement() {
		clickSound.play();
		$metronome = Math.max($metronome - 1, defaultMetronome);
	}
</script>

<div class="flex flex-col w-full h-screen items-center justify-center gap-2">
	<div class="flex flex-row items-center justify-center gap-10">
		<ButtonController class="shrink-0" onClick={decrement}>-</ButtonController>
		<input
			class="remove-arrow text-center"
			type="number"
			bind:value={$metronome}
			on:click={() => ($playing = false)}
		/>
		<ButtonController class="shrink-0" onClick={increment}>+</ButtonController>
	</div>
	<ButtonController onClick={() => ($playing = !$playing)}>
		{#if $playing}
			<Pause />
		{:else}
			<Play />
		{/if}
	</ButtonController>
</div>

<style>
	.remove-arrow {
		all: unset;
		appearance: none;
		text-align: center;
		-webkit-appearance: none;
		-moz-appearance: none;
	}
	.remove-arrow::-webkit-inner-spin-button,
	.remove-arrow::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
</style>
