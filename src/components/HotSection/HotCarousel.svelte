<script>
    import Carousel from '@beyonk/svelte-carousel';
    import HotOffer from "./HotOffer.svelte";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition"
    import axios from "axios";
    
    let carousel, innerWidth;
    let hotEstates = [];
    onMount(()=> {
        axios.get('estates/getTop')
        .then(({data}) => {
           hotEstates = data;
        })
        .catch(err => {
            console.log(err);
        })
    });
</script>

<style>

    section {
        display: flex;
        flex-direction: column;
        padding: 0;
        max-width: 100%;
    }

    .hot-section > span {
        font-weight: 800;
        font-size: 26px;
        padding-left: 1em;
        display: block;
        text-align: center;
        padding-left: 0 !important;
        margin: .5em 0 .3em 0;
    }
    :global(.hot-section > .carousel > ul) {
        margin-top: 0;
    }
    :global(.hot-section .carousel > ul > li) {
        background-color: #2c3e50a1;
        border: 1px solid white;
    }
    :global(.hot-section .carousel > ul > li.active) {
        background-color: #4a40d4;
    }

    @media only screen and (max-width: 400px) {
        .hot-section > .hot-header-text {
            font-size: 22px;
        }
    }
    
</style>

<svelte:window bind:innerWidth/>
{#if hotEstates[0]}
<section in:fade class="hot-section-wrapper" 
on:mouseenter={()=> {carousel&&carousel.pause()}} on:mouseleave={()=> {carousel&&carousel.resume()}}
>

    <div class="hot-section">
        <span class="hot-header-text">Лучшие предложения 🔥</span>
        <Carousel bind:this={carousel} controls={false} perPage={{1650: hotEstates[1] ? 2 : 1}} autoplay={0} duration={800} > 
            {#each hotEstates as estate}
            <HotOffer {estate} {carousel}/>
            {/each}
        </Carousel>
    </div>



</section> 
{/if}