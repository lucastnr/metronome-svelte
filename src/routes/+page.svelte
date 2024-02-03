<script lang="ts">
	import ButtonController from '../components/ButtonController.svelte';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	const storageKey = 'metronome';

	let metronome = (() => {
		if (!browser) return 0;
		const cached = $page.url.searchParams.get(storageKey) || '';
		return isNaN(+cached) ? 0 : +cached;
	})();

	// Deal with caching the new metronome value
	$: (() => {
		if (!browser) return;
		const cache = metronome.toString();
		$page.url.searchParams.set(storageKey, cache);
		goto($page.url);
	})();

	function increment() {
		metronome++;
	}

	function decrement() {
		metronome = Math.max(metronome - 1, 0);
	}
</script>

<div class="flex flex-row w-full h-screen items-center justify-center gap-10">
	<ButtonController class="shrink-0" onClick={decrement}>-</ButtonController>
	<p>{metronome}</p>
	<ButtonController class="shrink-0" onClick={increment}>+</ButtonController>
</div>
