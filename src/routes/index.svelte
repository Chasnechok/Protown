<script context="module">
	export async function preload(page, session) {
        const { agentIdentifier } = session;
        const isAdmin = agentIdentifier?true:false;
		const resHotEstates = await this.fetch(`estates/getTop`);
		const hotEstates = await resHotEstates.json();
        const resChangeRates = await this.fetch(`/getCourses`);
        const changeRates = await resChangeRates.json();
        const resFiltersProps = await this.fetch(`/estates/getParametres`);
        const filtersProps = await resFiltersProps.json();
		return { hotEstates, changeRates, filtersProps, isAdmin };
	}
</script>

<script>
    import FilterBar from "../components/FilterBar/FilterBar.svelte";
    import HotCarousel from "../components/HotSection/HotCarousel.svelte";
    import EstateList from "../components/Grid/EstatesList.svelte";
    import { setContext } from "svelte";
    export let hotEstates = [];
    export let changeRates;
    export let filtersProps;
    export let isAdmin;
    setContext("changeRates", changeRates);
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
    <FilterBar {filtersProps} />
    <HotCarousel {hotEstates}/>
    <EstateList {isAdmin} />
</section>