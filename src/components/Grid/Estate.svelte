<script>
    import { Swiper, SwiperSlide } from 'swiper/svelte';
	import SwiperCore, { Navigation, Lazy, A11y } from 'swiper';
    SwiperCore.use([Navigation, Lazy, A11y]);
    import 'swiper/swiper-bundle.min.css';
    import { onMount } from "svelte";
    import { changeRates, currencyOnPage } from "../../helpers/parametres";
    import { currencyCalculator } from "../../helpers/converter";
    import { numberToPhrase } from "../../helpers/numToString";
import A from '../../routes/[...estate].svelte';

    export let estate;
    //console.log(estate);
    const images = estate.images && estate.images[0] ? estate.images.map((el,i) => ({id: i, src:`https://assets.rich-house.online/estates/${estate.type}/${estate._id}/${el}`})) : undefined;
    $: priceInWords = numberToPhrase($currencyOnPage, currencyCalculator(estate.price, $currencyOnPage, estate.currency, $changeRates));
    let mounted = false;
    onMount(()=>mounted=true);
</script>

<style>
    .estate-card {
        display: flex;
        flex-wrap: wrap;
        padding: 1em;
        background-color: #ffffff;
        border-radius: .3em;
        border: 1px solid #e2e2e2;
        box-shadow: inset 0px 0px 6px rgb(0 0 0 / 15%);
        max-width: 100%;
        justify-content: center;
    }
    .images-wrapper-ms {
        border-radius: .3em;
        height: 300px;
        width: 320px;
        --swiper-theme-color: #6262DB;
        position: relative;
        margin: 0 auto;
    }
    .estate-image-lazy {
        width: 100%;
        height: 300px;
        border-radius: 8px;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
    }

    .props {
        width: 320px;
        margin-left: 2em;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .price-wrapper {
        font-size: 22px;
        display: flex;
        align-items: baseline;
        justify-content: center;
        flex-wrap: wrap;
        cursor: default;
    }
    .price-wrapper .price {
        font-size: 24px;
    }

    .adress {
        margin-top: -10px;
        display: block;
        text-align: center;
        flex: 1 1 100%;
        font-size: 16px;
    }

    .details .detail {
        display: flex;
        align-items: baseline;
        line-height: 19px;
        margin: 8px 0;
    }

    .value-label, .detail-label {
        flex: 1;
    }
    .detail-label {
        display: block;
        margin-right: 4em;
        text-align: end;
        color: #5a5a5a;
    }
    .labels {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
    }   
    .label {
        border-radius: 8px;
        padding: 8px;
        text-align: center;
        display: flex;
        align-items: center;
    }
    .label svg {
        width: 20px;
        height: 20px;
        margin-right: 8px;
        color: #6262db;
    }

    
    a {
        text-decoration: none;
        text-align: center;
        padding: 0.1em 1em;
        border-radius: 8px;
        transition: .3s;
        border: 1px solid #a9a9a9;
        display: block;
        color: #464646;
        background: transparent;
        width: 100%;
        cursor: pointer;
        transition: .3s;
    }

    a:hover, a:active, a:focus {
        letter-spacing: 1px;
        border-color: #6262db;
        color: #6262db;
    }

    @media only screen and (max-width: 1024px) {
        .estate-card {
            flex-direction: column;
            align-items: center;
        }
        .props {
            margin-left: 0;
        }
    }

    @media only screen and (max-width: 768px) {
        .estate-card {
            flex-direction: row;
            align-items: initial;
        }
        .props {
            margin-left: 1em;
        }
    }
    @media only screen and (max-width: 694px) {
        .estate-card {
            flex-direction: column;
            align-items: center;
        }
        .props {
            margin-left: 0;
        }
    }
    @media only screen and (max-width: 374px) {
        .images-wrapper-ms {
            width: 100%;
        }
        .props {
            width: 100%;
        }
    }

    @media only screen and (max-width: 350px) {
        .estate-card {
            border-radius: 0px;
        }
    }
   
</style>

<div class="estate-card">
   
    <div class="images-wrapper-ms">
        {#if estate.images && mounted}
        <Swiper
			spaceBetween={4}
			slidesPerView={1}
			speed={700}
            grabCursor
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
				loadPrevNext: false, loadOnTransitionStart: true, elementClass: "estate-image-lazy",
				loadedClass: "estate-image-lazy-loaded", loadingClass: "estate-image-lazy-loading"
				}}
		>
			{#each images as estateImage}
			<SwiperSlide>
				<div data-background={`https://naver.github.io/egjs-infinitegrid/assets/image/${Math.floor(Math.random() * 60) + 1}.jpg`} class="estate-image-lazy">
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

    <div class="props">
        <div class="labels">
            <div class="label">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span>{estate.type==="flat"?"Квартира":estate.type==="house"?"Дом":estate.type==="commersion"?"Коммерция":estate.type==="land"?"Участок":"Бог знает что"}</span>
            </div>
            <div class="label">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span>{estate.deal==="lease"?"Аренда":estate.deal==="buy"?"Продажа":"Бог знает что"}</span>
            </div>
            {#if estate.extras.fee == false}
            <div class="label">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span class="no-fee">0% комиссии</span>
            </div>
            {/if}
        </div>
        
        <div class="price-wrapper" title={priceInWords}>
            <span class="price" >{currencyCalculator(estate.price, $currencyOnPage, estate.currency, $changeRates)}</span><span class="price-currency">&nbsp{$currencyOnPage === "USD" ? "$" : $currencyOnPage === "EUR" ? "€" : "₴"}{estate.deal === "lease" ? " / месяц" : ""}</span>
            <span class="adress">{estate.adress.city.ru[0].toUpperCase()+estate.adress.city.ru.slice(1)+ (estate.adress.street ? `, ${estate.adress.street.ru}` : "") + (estate.adress.estateNumber ?  `, дом ${estate.adress.estateNumber}` : "")}</span>
        </div>
        <div class="details">
            <div class="detail">
                <span class="detail-label">Общая</span>
                <span class="value-label">{estate.details.area.g}м<sup><small>2</small></sup></span>
            </div>
            {#if estate.details.rooms}
            <div class="detail">
                <span class="detail-label">Комнаты</span>
                <span class="value-label">{estate.details.rooms}</span>
            </div>
            {/if}
            {#if estate.details.gfloor || estate.details.floor}
            <div class="detail">
                <span class="detail-label">{!estate.details.floor && estate.details.gfloor? "Этажность" : "Этаж"}</span>
				<span class="value-label">
					{estate.details.floor && estate.details.gfloor ? estate.details.floor + " / " + estate.details.gfloor :
					estate.details.floor ? estate.details.floor : estate.details.gfloor ? estate.details.gfloor : "не указано"
					}
				</span>
            </div>
            {/if}
        </div>
        <a href="/">детали</a>
    </div>


</div>