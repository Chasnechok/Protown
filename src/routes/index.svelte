<script>
    import FilterBar from "../components/FilterBar/FilterBar.svelte";
    import HotCarousel from "../components/HotSection/HotCarousel.svelte";
    import EstateList from "../components/Grid/EstatesList.svelte";
</script>

<style>
    :root {
	--pagebg-color: #e5e5e5;
    }
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
    <HotCarousel />
    <EstateList />
</section>