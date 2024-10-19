<script context="module">
  export async function preload(page, session) {
    const { agentIdentifier } = session
    const isAdmin = agentIdentifier ? true : false
    const resHotEstates = await this.fetch(`estates/getTop`)
    const hotEstates = await resHotEstates.json()
    const resChangeRates = await this.fetch(`/getCourses`)
    const changeRates = await resChangeRates.json()
    const resFiltersProps = await this.fetch(`/estates/getParametres`)
    const filtersProps = await resFiltersProps.json()
    return { hotEstates, changeRates, filtersProps, isAdmin }
  }
</script>

<script>
  import FilterBar from '../components/FilterBar/FilterBar.svelte'
  import HotCarousel from '../components/HotSection/HotCarousel.svelte'
  import EstateList from '../components/Grid/EstatesList.svelte'
  import { setContext } from 'svelte'
  export let hotEstates = { count: 0, items: [] }
  export let changeRates
  export let filtersProps
  export let isAdmin
  setContext('changeRates', changeRates)
</script>

<svelte:head>
  <title>ProTown</title>
</svelte:head>

<section>
  {#if hotEstates.allCount > 0}
    <FilterBar {filtersProps} />
    <HotCarousel hotEstates={hotEstates.items} />
    <EstateList {isAdmin} />
  {:else}
    <div class="nothing">
      <h1>Так пусто...</h1>
      <h3>На сайте пока нет объявлений</h3>
      <a href="/contact">Можете предложить своё 😊</a>
    </div>
  {/if}
</section>

<style>
  section {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
  }
  .nothing {
    width: 383px;
    width: fit-content;
    margin: 0 auto;
  }
  .nothing h1 {
    margin-left: -2px;
  }
  .nothing a {
    text-decoration: none;
    display: block;
    text-align: center;
    border: 1px solid #c0c1c1;
    outline: none;
    padding: 5px 12px;
    color: inherit;
    font-size: 16px;
    border-radius: 6px;
    background-color: #eaeaea;
    box-shadow: inset 0 1px 0 rgb(255 228 232 / 20%);
    min-height: 2em;
    transition: 0.3s;
  }
  .nothing a:hover {
    background-color: #838de7;
    color: white;
    box-shadow: inset 0 1px 0 #4a40d4;
    border: 1px solid #4a40d4;
  }
</style>
