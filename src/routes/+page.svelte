<script lang="ts">
	import { afterUpdate, createEventDispatcher, onDestroy } from 'svelte';
	import ButtonController from '../components/ButtonController.svelte';
	import Play from 'svelte-material-icons/Play.svelte';
	import Pause from 'svelte-material-icons/Pause.svelte';

	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import metronomeMp3 from '../assets/metronome.mp3';
	import clickMp3 from '../assets/click.mp3';
	import { Sound } from 'svelte-sound';
	import { writable } from 'svelte/store';

	const metronomeSound = new Sound(metronomeMp3);
	const clickSound = new Sound(clickMp3, { volume: 0.07 });

	const storageKey = 'metronome';
	const defaultMetronome = 60;

	let metronome = (() => {
		if (!browser) return defaultMetronome;
		const cached = $page.url.searchParams.get(storageKey) || '';
		return isNaN(+cached) ? defaultMetronome : +cached;
	})();
	let playing = false;

	// Deal with caching the new metronome value
	$: (() => {
		if (!browser) return;

		const cache = (metronome || defaultMetronome).toString();
		$page.url.searchParams.set(storageKey, cache);
		goto($page.url);
	})();

	let intervalId = writable<null | number>(null);
	let timeoutId = writable<null | number>(null);

	$: (async () => {
		let currentInterval: null | number = null;
		intervalId.update((current) => {
			currentInterval = current;
			return current;
		});
		let currentTimeout: null | number = null;
		intervalId.update((current) => {
			currentTimeout = current;
			return current;
		});

		if (!browser) return;
		if (currentInterval) {
			clearInterval(currentInterval);
			intervalId.update(() => {
				return null;
			});
		}
		if (currentTimeout) {
			clearTimeout(currentTimeout);
			timeoutId.update(() => {
				return null;
			});
		}

		if (!playing) return;

		await new Promise((resolve) => {
			timeoutId.update(() => setTimeout(resolve, 1000));
		});
		console.log('tick');

		metronomeSound.play();
		const interval = 60000 / metronome;
		intervalId.update(() =>
			setInterval(async () => {
				console.log('tick');
				metronomeSound.play();
			}, interval)
		);
	})();

	function increment() {
		clickSound.play();
		metronome++;
	}

	function decrement() {
		clickSound.play();
		metronome = Math.max(metronome - 1, defaultMetronome);
		metronome = Math.min(metronome, defaultMetronome);
	}
</script>

<div class="flex flex-col w-full h-screen items-center justify-center gap-2">
	<div class="flex flex-row items-center justify-center gap-10">
		<ButtonController class="shrink-0" onClick={decrement}>-</ButtonController>
		<input
			class="remove-arrow text-center"
			type="number"
			bind:value={metronome}
			on:click={() => (playing = false)}
		/>
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
