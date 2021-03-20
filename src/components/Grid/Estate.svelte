<script>
    import { Swiper, SwiperSlide } from 'swiper/svelte';
	import SwiperCore, { Navigation, Lazy, A11y } from 'swiper';
    SwiperCore.use([Navigation, Lazy, A11y]);
    import 'swiper/swiper-bundle.min.css';
    import { onMount } from "svelte";
    import { changeRates, currencyOnPage } from "../../helpers/parametres";
    import { currencyCalculator } from "../../helpers/converter";
    import { numberToPhrase } from "../../helpers/numToString";
    export let estate;
    export let isHot = false;
    //console.log(estate);
    const images = estate.images && estate.images[0] ? estate.images.map((el,i) => ({id: i, src:`https://assets.rich-house.online/estates/${estate.type}/${estate._id}/${el}`})) : undefined;
    $: priceInWords = numberToPhrase($currencyOnPage, currencyCalculator(estate.price, $currencyOnPage, estate.currency, $changeRates));
    let mounted = false;
    onMount(()=>mounted=true);
</script>

<style>
    .estate-card {
        display: flex;
        position: relative;
        padding: 1em;
        background-color: white;
        box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.15);
        width: 100%;
        border-radius: .3em;
        flex-direction: column;
        height: 100%;
    }
    .estate-label {
        padding: 0 20px;
    }
    .estate-card .props-wrapper {
        display: flex;
        width: 100%;
        flex-direction: column;
        align-items: center;
        position: absolute;
        left: 0;
        backdrop-filter: blur(4px);
        background-color: rgba(255, 255, 255, 0.5);
        padding-bottom: .5em;
        z-index: 2;
        cursor: pointer;
    }
    .estate-card .props-wrapper .main-prop {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        font-size: 14px;
        font-weight: 500;
        text-transform: uppercase;
        color: rgba(0, 0, 0, 0.5);
    }
    .estate-card .main-prop .deal, .estate-card .main-prop .fee {
        display: flex;
        align-items: center;
    }
    .estate-card .main-prop .deal::before, .estate-card .main-prop .fee::before {
        content: "";
        width: 8px;
        height: 8px;
        display: block;
        border-radius: 50%;
        background-color: rgba(0, 0, 0, 0.5);
        margin: 0 1em;
    }
    .estate-card .estate-label-header {
        font-size: 18px;
        font-weight: bold;
        margin-top: .2em;
        color: #333333;
    }
    .estate-card .estate-label-adress {
        margin-top: -5px;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.5);
    }
    .images-wrapper-ms {
        border-radius: .3em;
        height: 100%;
        width: 100%;
        --swiper-theme-color: #6262DB;
    }
    .estate-image-lazy {
        width: 100%;
        height: 268px;
        border-radius: 8px;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
    }
   
    .estate-card .estate-price-wrapper {
        display: flex;
        align-items: center;
        margin-top: .5em;
    }
    .estate-card .estate-price-wrapper .price {
        font-weight: 500;
    }
    
    @media only screen and (max-width: 375px) {
        .estate-card .props-wrapper {
            padding: .5em 1em;
        }
        .estate-card .props-wrapper .main-prop {
            font-size: 12px;
        }
        .estate-card .estate-label-header {
            font-size: 14px;
            text-align: initial;
        }
    }
    @media only screen and (max-width: 325px) {
        .estate-card .main-prop .deal::before, .estate-card .main-prop .fee::before {
            margin: 0 .5em;
            width: 5px;
            height: 5px;
        }
    }
</style>

<div class="estate-card">
    <div class="props-wrapper">
        <div class="main-prop">
            <div class="type">{estate.type ? estate.type === "house" ? "Дом" : estate.type === "flat" ? "Квартира" : estate.type === "land" ? "Участок" : "Коммерция" : "Квартира"}</div>
            <div class="deal">{estate.deal ? estate.deal === "buy" ? "Продажа" : "Аренда" : "Аренда"}</div>
            {#if estate.extras&&estate.extras.fee === false}
                <div class="fee">0% комиссии</div>
            {/if}
        </div>
        <a style="text-decoration: none;" rel=prefetch href={isHot?`/${estate.type}/${estate._id}`:"."}>
        <div class="estate-label">
            <div class="estate-label-header">{estate.label ? estate.label : "Бог знает что"}</div>
            <div class="estate-label-adress">
                {estate.adress ? 
                estate.adress.city.ru[0].toUpperCase()+estate.adress.city.ru.slice(1)+ (estate.adress.street ? `, ${estate.adress.street.ru}` : "")+(estate.adress.estateNumber ?  `, дом ${estate.adress.estateNumber}` : "")
            : 'Шевченко 48'}
            </div>
            <div class="estate-price-wrapper" title={priceInWords}>
                <span class="price">{currencyCalculator(estate.price, $currencyOnPage, estate.currency, $changeRates)}</span><span class="price-currency">&nbsp{$currencyOnPage === "USD" ? "$" : $currencyOnPage === "EUR" ? "€" : "₴"}{estate.deal === "lease" ? " / месяц" : ""}</span>
            </div>
        </div>
        </a>
    </div>
    <div class="images-wrapper-ms">
        {#if estate.images && mounted}
        <Swiper
			spaceBetween={4}
			slidesPerView={1}
			speed={700}
			a11y={{
				containerMessage: "Секция с изображениями объекта",
				firstSlideMessage: "Первое изображение",
				lastSlideMessage: "Последнее изображение",
				nextSlideMessage: "Следующее изображение",
				prevSlideMessage: "Предыдущее изображение",
				paginationBulletMessage: "Изменить слайд с изображением"
			}}
			pagination={{ clickable: true, dynamicBullets: true }}
            lazy={{	
				loadPrevNext: true, elementClass: "estate-image-lazy",
				loadedClass: "estate-image-lazy-loaded", loadingClass: "estate-image-lazy-loading"
				}}
		>
			{#each images as estateImage}
			<SwiperSlide>
				<div data-background={!isHot?`https://naver.github.io/egjs-infinitegrid/assets/image/${Math.floor(Math.random() * 60) + 1}.jpg`:estateImage.src} class="estate-image-lazy">
                    <div class="swiper-lazy-preloader"></div>
                  </div>
			</SwiperSlide>
			{/each}
		</Swiper>

        {:else}
        <div>
            <span>Изображений нет</span>
        </div>
        {/if}
    </div>
</div>