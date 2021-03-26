<script>
    import { Swiper, SwiperSlide } from 'swiper/svelte';
	import SwiperCore, { Pagination, Autoplay } from 'swiper';
    SwiperCore.use([ Pagination, Autoplay]);
    import 'swiper/swiper-bundle.min.css';
    import HotOffer from "./HotOffer.svelte";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    let mounted = false;
    export let hotEstates = [];
    onMount(()=> {
       mounted = true;
    });
</script>

<style>

    section {
        padding: 0;
        max-width: 100%;
        margin-top: 2em;
        --swiper-theme-color: #6262DB;
    }

    .hot-section > h2 {
        font-weight: 600;
        text-align: center;
        margin: .5em 0 2em 0;
        position: relative;
        padding: 0 2em;
    }
    .hot-section > h2::before {
        content: "";
        display: block;
        position: absolute;
        width: 100%;
        height: 1px;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        background-color: #333;
        z-index: 0;
    }
    .hot-section > h2 span {
        padding: 0 2em;
        background-color: #ffffff;
        z-index: 1;
        position: relative;
    }
    .swiper-container-wrapper {
        position: relative;
        min-height: 545px;
    }
    .swiper-container-wrapper::before{
        content: "";
        display: block;
        position: absolute;
        width: 200vw;
        left: -100vw;
        top: 50%;
        transform: translateY(-50%);
        height: 100%;
        z-index: 0;
        background-color: #efefef;
        padding: 1em 0;
    }
    @media only screen and (max-width: 820px) {
        .swiper-container-wrapper {
            min-height: 500px;
        }
    }
    @media only screen and (max-width: 694px) {
        .swiper-container-wrapper {
            min-height: 620px;
        }
    }
    @media only screen and (max-width: 500px) {
        .hot-section > .hot-header-text span {
            font-size: 20px;
            padding: 0 1em;
        }
    }
    @media only screen and (max-width: 374px) {
        .hot-section > .hot-header-text span {
            font-size: 16px;
            padding: 0 1em;
        }
    }
    
</style>

{#if hotEstates[0]}
<section in:fade class="hot-section-wrapper" id="hot-section" >

    <div class="hot-section">
        <h2 class="hot-header-text"><span>Лучшие предложения 🔥</span></h2>
        <div class="swiper-container-wrapper">
            {#if mounted}
            <Swiper
			spaceBetween={10}
			slidesPerView={1}
			speed={700}
            autoplay={{delay: 8000}}
            direction="horizontal"
            breakpoints={{
                1650: {
                  slidesPerView: 2
                }
            }}
			pagination={{ clickable: true, dynamicBullets: true }}
		    >
			{#each hotEstates as estate}
				<SwiperSlide>
                    <HotOffer {estate}/>
				</SwiperSlide>
			{/each}
		    </Swiper>
            {/if}
        </div>
        
    </div>



</section> 
{/if}