<script>
    import Carousel from '@beyonk/svelte-carousel';
    import HotOffer from "./HotOffer.svelte";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition"
    import axios from "axios";
    
    let carousel, innerWidth;
    let hotEstates;
    onMount(()=> {
        axios.get('estates/getTop')
        .then(({data}) => {
           hotEstates = data;
        })
        .catch(err => {
            hotEstates = [];
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
    /* :global(.hot-section-wrapper > .carousel::before) {
        content: "";
        display: block;
        position: absolute;
        width: 1000%;
        height: 20%;
        background-image: url("data:image/svg+xml,<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='40' height='40' patternTransform='scale(2) rotate(0)'><rect x='0' y='0' width='100%' height='100%' fill='hsla(0, 0%, 90%, 1)'/><path d='M45.69 13.342c-1.677.945-3.557 1.6-5.48 1.588-1.922-.012-3.795-.691-5.462-1.653-1.668-.962-3.156-2.202-4.637-3.435-1.48-1.232-2.97-2.47-4.641-3.427-1.67-.957-3.547-1.628-5.47-1.628-1.923 0-3.8.67-5.47 1.628-1.67.956-3.161 2.195-4.641 3.427-1.48 1.233-2.97 2.473-4.637 3.435-1.667.962-3.54 1.641-5.463 1.653-1.922.012-3.802-.643-5.478-1.588v13.316c1.676-.945 3.556-1.6 5.478-1.588 1.923.012 3.796.691 5.463 1.653 1.668.962 3.156 2.202 4.637 3.435 1.48 1.232 2.97 2.47 4.641 3.427 1.67.957 3.547 1.628 5.47 1.628 1.923 0 3.8-.67 5.47-1.628 1.67-.956 3.161-2.195 4.641-3.427 1.48-1.233 2.97-2.473 4.637-3.435 1.667-.962 3.54-1.641 5.463-1.653 1.922-.012 3.802.643 5.478 1.588z'  stroke-width='2' stroke='hsla(259, 0%, 100%, 1)' fill='none'/></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(%23a)'/></svg>");
        background-repeat: repeat-x;
        left: -100%;
        top: 50%;
        transform: translateY(-50%);
        z-index: -1;
    } */
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
{#if hotEstates}
<section in:fade class="hot-section-wrapper" 
on:mouseenter={()=> {carousel.pause()}} on:mouseleave={()=> {carousel.resume()}}
>

    <div class="hot-section">
        <span class="hot-header-text">Лучшие предложения 🔥</span>
        <Carousel bind:this={carousel} controls={false} perPage={{1650: 2}} autoplay={0} duration={800} > 
            {#each hotEstates as estate}
            <HotOffer {estate} {carousel}/>
            {/each}
        </Carousel>
    </div>



</section> 
{/if}