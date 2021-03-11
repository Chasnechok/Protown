<script>
    import FilterBar from "../components/FilterBar/FilterBar.svelte";
    import EstatesList from "../components/Grid/EstatesList.svelte";
    import HotCarousel from "../components/HotSection/HotCarousel.svelte";
    import { ArrowUpCircleIcon } from 'svelte-feather-icons'
    let scrollY;
</script>

<style>
    .main-wrapper{
        --gridLayout: 30% 70%;
        min-height: 1080px;
        display: grid;
        grid-template-columns: var(--gridLayout);
    }
    .main-wrapper-right{
        grid-column: 2;
        display: flex;
        flex-direction: column;
    }
    .to-top{
        height: 40px;
        width: 40px;
        position: fixed;
        background: transparent;
        right: 2%;
        bottom: 5%;
        z-index: 11;
    }
    .to-top:hover{
        cursor: pointer;
        transform: translateY(-0.5em);
    }
    .to-top:active{
        cursor: pointer;
        transform: translateY(-1em);
    }

    @media only screen and (max-width: 1650px) {
        .main-wrapper{
            --gridLayout: 35% 65%
        }
    }
 
</style>

<svelte:window bind:scrollY/>
<svelte:head>Rich House</svelte:head>
<div class="main-wrapper">
    <FilterBar/>
    <div class="main-wrapper-right">
        <HotCarousel />
        <EstatesList />
    </div>
    {#if scrollY > 100}
    <div class="to-top" on:click={()=> scrollY = 0}>
        <ArrowUpCircleIcon />
    </div>
    {/if}
</div>
