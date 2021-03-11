<script>
  import axios from "axios";
  import { onMount } from 'svelte';
  import { GridLayout } from '@egjs/svelte-infinitegrid';
  import { SyncLoader } from 'svelte-loading-spinners';
  import { scrollToBottom } from "svelte-scrollto";
  import { filters, items, noMore, districtSelector } from "../../helpers/filterStore";
  import Estate from "./Estate.svelte";
  let mountedToDom = false;
  let ig;
  let loading;
  $: nothingFound = $noMore && !$items[0] ? true : false;
 
  const loadItems = async (nextKey, itemCount) => {
    let nextItems = [];
    await axios.get("/estates/getEstates",
    { 
      params: {
        nextKey: nextKey,
        count: itemCount,
        filters: $filters
      }
    }
   )
   .then(r => {
    if(r.data.noMore) $noMore = true;
    if (r.data.estates) console.log("FETCHED");
    nextItems = r.data.estates
    })
   .catch(e => console.log(e))
    return nextItems;
  }
  
  const onAppend = async (event) => {
    //let groupKey = event.detail.groupKey;
    let startLoading = event.detail.startLoading;
    if ($noMore) {
    return onLayoutComplete(event);
    }
    startLoading()
    // await sleep(3000)
    //const nextGroupKey = (parseFloat(groupKey) || 0) + 1
    const nextKey = $items.length;
    $items = [...$items, ...await loadItems(nextKey, 8)];
    console.log($items);
  }
  
  const onLayoutComplete = ({ detail: { isLayout, endLoading } }) => { endLoading() }
  
  onMount(() => { 
    mountedToDom = true;
  })
</script>

<style>

  section {
    width: 100%;
    margin: 2em 0;
  }
  .hot-header {
    text-align: center;
    font-weight: 800;
    font-size: 26px;
    margin-bottom: 1em;
  }
  .estate-wrapper {
    width: 340px;
    height: 300px;
  }
  .loading {
    left: 50%;
    transform: translateX(-50%);
  }
  .nothing-found {
    display: flex;
    flex-direction: column;
  }
  .nothing-found span {
    text-align: center;
    margin-bottom: .5em;
  }
  .nothing-found button {
    margin: 0 auto;
    padding: 1em 2em;
    border: none;
    transition: .5s;
    border-radius: .5em;
    font-size: 16px;
    background-color: rgb(98, 98, 219, 0.9);
    color: white;
  }
  button:hover {
    cursor: pointer;
    transform: scaleX(1.1);
  }
  
  @media only screen and (max-width: 400px) {
    section > .hot-header > .hot-header-text {
      font-size: 22px;
    }
  }

</style>

<section id="all-estates-section" class="all-estates-section">
<div class="hot-header">
  <span class="hot-header-text">Все предложения 👇</span>
  </div>
  {#if mountedToDom}
    <GridLayout
    items={$items}
    {loading}
    bind:this={ig}
    let:visibleItems 
    itemBy={item => item._id}
    layoutOptions={{ align: "center", margin: 15, column: [1,4] }}
    on:append={onAppend}
    on:layoutComplete={onLayoutComplete}
    options={{ isConstantSize: true, transitionDuration: 0.7, itemCount: 1, isEqualSize: true }}
    >
      {#each visibleItems as estate, index (estate._id)}
        <div class="estate-wrapper">
          <Estate {estate} />
        </div>
      {/each}
      <div bind:this={loading} slot="loading" class="loading">
        <SyncLoader color="#6262DB"/>
      </div>
    </GridLayout>
    {#if nothingFound}
      <div class="nothing-found">
        <span>По заданным фильтрам ничего не нашли</span>
        <button on:click={()=>(filters.reset($districtSelector), $items = [], $noMore = false, scrollToBottom())}>Сбросить фильтры</button>
      </div>
    {/if}
  {/if}
</section>