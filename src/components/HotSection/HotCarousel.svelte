<script>
    import { Swiper, SwiperSlide } from 'swiper/svelte';
	import SwiperCore, { Pagination, Autoplay } from 'swiper';
    SwiperCore.use([ Pagination, Autoplay]);
    import 'swiper/swiper-bundle.min.css';
    import HotOffer from "./HotOffer.svelte";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition"
    import axios from "axios";
    
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
        padding: 0;
        max-width: 100%;
        --swiper-theme-color: #6262DB;
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

    @media only screen and (max-width: 400px) {
        .hot-section > .hot-header-text {
            font-size: 22px;
        }
    }
    
</style>

{#if hotEstates[0]}
<section in:fade class="hot-section-wrapper" >

    <div class="hot-section">
        <span class="hot-header-text">Лучшие предложения 🔥</span>
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
    </div>



</section> 
{/if}