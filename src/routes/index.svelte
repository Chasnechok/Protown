<script context="module">
	export async function preload() {
		const res = await this.fetch(`estates/getTop`);
		const hotEstates = await res.json();
		return { hotEstates };
	}
</script>

<script>
    import FilterBar from "../components/FilterBar/FilterBar.svelte";
    import HotCarousel from "../components/HotSection/HotCarousel.svelte";
    import EstateList from "../components/Grid/EstatesList.svelte";
    export let hotEstates = [];
</script>

<style>
    section {
        display: flex;
        flex-wrap: wrap;
        flex-direction: column;
    }
</style>

<svelte:head>
	<title>Rich House</title>
</svelte:head>

<section>
    <FilterBar />
    <HotCarousel {hotEstates}/>
    <EstateList />
</section>