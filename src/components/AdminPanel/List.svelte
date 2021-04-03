<script>
    import axios from "axios";
    import Estate from "../Grid/Estate.svelte";
    import { Circle } from 'svelte-loading-spinners';
    import { onMount } from "svelte";
    export let page = 1;
    let bufferedEstates;
    export let pagesCount = 1;
    let isLoading = false;
    let mounted = false;
    onMount(()=>mounted=true);
    $: if(mounted) handleLoadEstates(page);

    const handleLoadEstates = async (page) => {
        isLoading = true;
        const nextKey = parseInt(page, 10)>0?(parseInt(page, 10)-1)*8:0;
        await axios.get("/estates/getEstates",
            { params: {
                nextKey,
                count: 8,
                filters: {isInitial:true, displayHidden: true}
            }}).then(r=>{
            isLoading=false;
            bufferedEstates = r.data.estates;
            pagesCount = Math.ceil(r.data.length/8);
        }).catch(console.log)
    }
</script>

<style>
    .list-wrapper {
        position: relative;
    }
    .gray-screen {
        position: absolute;
        width: 100%;
        height: 105%;
        top: 0;
        left: 0;
        backdrop-filter: blur(2px);
        z-index: 998;
    }
    .pagination {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
    }
    .page:focus {
        outline: 0 !important;
    }
    .page {
        padding: 1em;
        background: white;
        border-radius: .5em;
        border: 1px solid rgb(169, 169, 169);
        display: block;
        color: #464646;
        transition: .3s;
        margin: .5em .5em 0 .5em;
    }
    .page.active {
        font-weight: bold;
        border-color: #6262db;
        color: #6262db;
        pointer-events: none;
    }
    .page:hover:enabled:not(.active), .page:focus:enabled:not(.active) {
        cursor: pointer;
        letter-spacing: 1px;
        border-color: #6262db;
        color: #6262db;
    }
    .estates-wrapper {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
    }
    .estate-card-wrapper {
        max-width: 750px;
        padding: 1em 1em 0 1em;
    }
</style>
<div class="list-wrapper">
    {#if isLoading}
        <div class="gray-screen"></div>
    {/if}
    <div class="pagination" >
        {#each Array(pagesCount) as _, i}
            <button disabled={isLoading} on:click={()=>{page=i+1; handleLoadEstates(page)}} class="page" class:active={i+1==page}>
                {#if isLoading && i+1==page}
                <Circle size="10" color="#6262db" unit="px" />
                {:else}
                {i+1}
                {/if}
            </button>
        {/each}
    </div>
    {#if bufferedEstates}
    <div class="estates-wrapper">
        {#each bufferedEstates as estate}
        <div class="estate-card-wrapper">
            <Estate {estate} isAdmin={true} />
        </div>
        {/each}
    </div>
    {/if}
    {#if bufferedEstates}
    <div class="pagination" style="margin-top: 1em;" >
        {#each Array(pagesCount) as _, i}
            <button disabled={isLoading} on:click={()=>{page=i+1; handleLoadEstates(page)}} class="page" class:active={i+1==page}>
                {#if isLoading && i+1==page}
                <Circle size="10" color="#6262db" unit="px" />
                {:else}
                {i+1}
                {/if}
            </button>
        {/each}
    </div>
    {/if}
</div>