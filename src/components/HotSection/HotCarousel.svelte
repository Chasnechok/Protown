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

    .hot-section h1 {
        font-weight: 500;
        text-align: center;
        margin:  0;
        position: relative;
        padding: 1em 0;
        line-height: 10px;
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
    @media only screen and (max-width: 374px) {
        .hot-section h1 {
            font-size: 1.5em;
        }
    }
    
</style>

{#if hotEstates[0]}
<section in:fade class="hot-section-wrapper" id="hot-section" >

    <div class="hot-section">
        <div class="swiper-container-wrapper">
            <h1 class="hot-header-text">Лучшие предложения 🔥</h1>
            {#if mounted}
            <Swiper
			spaceBetween={10}
			slidesPerView={1}
			speed={700}
            autoplay={{delay: 8000}}
            direction="horizontal"
            breakpoints={{
                1366: {
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