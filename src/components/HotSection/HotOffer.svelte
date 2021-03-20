<script>
    import { Swiper, SwiperSlide } from 'swiper/svelte';
	import SwiperCore, { Navigation, Pagination, Lazy, A11y } from 'swiper';
    SwiperCore.use([Navigation, Pagination, Lazy, A11y]);
    import 'swiper/swiper-bundle.min.css';
    import { changeRates, currencyOnPage } from "../../helpers/parametres";
    import { currencyCalculator } from "../../helpers/converter";
    import { numberToPhrase } from "../../helpers/numToString";
    import Estate from "../Grid/Estate.svelte";
    import { onMount } from "svelte";
    import { preventRightClick } from '../../helpers/preventRightClick';
    export let estate;
    let mounted, swiper, imageCarousel;
    onMount(()=>mounted=true)

    const images = estate.images && estate.images[0] ? estate.images.map((el,i) => ({id:i, src:`https://assets.rich-house.online/estates/${estate.type}/${estate._id}/${el}`})) : undefined;
    $: priceInWords = numberToPhrase($currencyOnPage, estate.price);
    //console.log(estate);

   
</script>

<style>
    .hot-offer-wrapper {
        background-color: transparent;
        padding: 3px 1em;
        margin: 0 auto;
        max-width: 900px;
        min-height: 580px;
        position: relative;
        display: flex;
    }
    
    .hot-offer-l {
        display: flex;
        position: relative;
        flex-wrap: wrap;
        width: 100%;
        background-color: white;
        box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.15);
        border-radius: .5em;
        padding: 1em;
        margin: auto 0;
    }
    :global(.image-carousel .swiper-button-prev, .image-carousel .swiper-button-next) {
		display: none;
		transition: .5s;
	}
	:global(.image-carousel:hover .swiper-button-prev, .image-carousel:hover .swiper-button-next) {
		display: block;
	}
    .image-carousel {
		margin: 2em 0;
		--swiper-theme-color: #6262DB;
		position: relative;
		border-radius: 8px;
    	background-color: white;
    	overflow: hidden;	
		transition: .7s;
        max-width: 70%;
    	flex: 1 1 70%;
	}
    .estate-image-lazy {
		max-height: 500px;
    	max-width: 100%;
    	display: block;
    	border-radius: 8px;
		object-fit: cover;
		margin: auto;
	}
	.image-wrapper {
    	background-color: white;
    	border-radius: 8px;
        min-height: 400px;
        display: flex;
	}
    .right {
        display: flex;
        flex-direction: column;
        padding: 1em;
        justify-content: space-between;
        flex: 0 0 40%;
        max-width: 30%;
    }
    .right .label{
        font-weight: bold;
        font-size: var(--headerFontSize, 20px);
        line-height: 100%;
    }
    .right .adress{
        font-weight: bold;
        font-size: var(--adressFontSize, 14px);
        color: rgba(0, 0, 0, 0.5);
    }
    .hot-offer-l .price-wrapper{
        background: #E5E5E5;
        border-radius: 10px;
        width: 100%;
        padding: 0.5em 0;
        text-align: center;
        cursor: default;
    }
    .hot-offer-l .price{
        font-weight: bold;
        font-size: 18px;
        line-height: 100%;
        letter-spacing: 2px;
    }
    .hot-offer-l .price-currency{
        color: #333333;
        font-weight: bold;
    }
    .sq{
        display: grid;
        grid-template-columns: repeat(3, 1fr);
    }
    .sq-header, .question{
        grid-column: 1/3;
        justify-self: start;
        grid-row: 1;
        font-weight: 600;
        font-size: 16px;
    }
    .prop-label, .value-label, .prop-label-vertical{
        font-weight: 500;
        font-size: 16px;
        color: rgba(0, 0, 0, 0.5);
    }
    .value-label {
        color: black;
    }
    .prop {
        display:flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        grid-row: 2;
        justify-self: center;
    }
    .sq-vertical{
        display: flex;
        flex-direction: column;
    }
    .prop-vertical{
        display: grid;
        grid-template-columns: repeat(3, 1fr);
    }
    .value-label-vertical{
        grid-column: 3;
        text-align: center;
    }
    .question, .sq-vertical, .sq, .price-wrapper {
        margin-top: 1em;
    }
    .answer{
        display: flex;
        align-items: center;
    }
    .contact-href:hover, .details-show-button:hover{
        cursor: pointer;
    }
    .details-show-button:hover{
        letter-spacing: 1px;
    }
    .contact-href{
        font-size: var(--answerFontSize, 14px);
        font-weight: 600;
        color: #6262DB;
        transition: .5s;
    }
    .details-show-button{
        color: white;
        text-align: center;
        padding: 0.5em 1em;
        background: rgba(98, 98, 219, 0.8);
        border-radius: 10px;
        transition: .5s;
    }
    .question, .or{
        font-size: var(--questionFontSize);
    }
    .prop-label-vertical{
        grid-column: 1/3;
    }
    
    .right .content {
        display: flex;
        flex-direction: column;
        position: relative;
    }
    .zero-fee {
        position: absolute;
        background-color: rgb(98, 98, 219, .8);
        padding: 4px 1em;
        text-align: center;
        color: white;
        font-size: 14px;
        right: 0;
        top: 0;
        border-radius: 0 0.5em;
        backdrop-filter: blur(5px);
        z-index: 2;
    }

    .hot-offer-ms {
        display: none;
        position: relative;
        width: 100%;
    }
    
    @media only screen and (min-width: 1650px) {
        .hot-offer-wrapper {
            max-width: 1000px;
        }
        .right {
            flex: 1 0 30%;
            max-width: 30%;
        }
        .right .question, .right .answer .contact-href {
            font-size: 0;
        }
        
        .right .question::after {
            font-size: 16px;
            content: "Есть вопросы?"
        }
        .right .answer .contact-href::after {
            font-size: 14px;
            content: "Позвонить"
        }
        .right .question-box, .right .answer {
            margin-top: .5em;
        }
    }
    @media only screen and (max-width: 1060px) {
        .contact-href, .or {
            display: block;
        }
        .right {
            padding: 0 1em 0 0;
        }
    }

    @media only screen and (max-width: 767px) {
        .hot-offer-wrapper {
            padding: 3px .5em;
            min-height: unset;
        }
        .hot-offer-l {
            display: none;
        }
        .hot-offer-ms {
            display: flex;
        }
        .right {
            max-width: 100%;
            padding: 0;
        }
        .right {
            padding: 1em 0 0 0;
        }
        .contact-href, .or {
            display: block;
        }

    }
    
</style>

<div class="hot-offer-wrapper">

<div class="hot-offer-ms">
    <Estate {estate} isHot={true} />
</div>

<div class="hot-offer-l">
    {#if estate.extras.fee === false}
        <div class="zero-fee">
            <span>0% комиссии</span>
        </div>
    {/if}
    {#if images&&images.length===estate.images.length && mounted}
        <div class="image-carousel" bind:this={imageCarousel}>
            <Swiper
				spaceBetween={10}
				slidesPerView={1}
				navigation
				speed={700}
				grabCursor
                nested
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
				on:swiper={({detail}) => {swiper = detail[0]; if(imageCarousel)imageCarousel.style="display: flex; align-items: center;"}}
				>
					{#each images as estateImage}
					<SwiperSlide>
						<div class="image-wrapper">
							<img use:preventRightClick data-src="{estateImage.src}" alt="{estate.type&&estate.type} image #{estateImage.id}" class="estate-image-lazy" />
						</div>
						<div class="swiper-lazy-preloader"></div>
					</SwiperSlide>
					{/each}
				</Swiper>
    </div>
    {/if}

    <div class="right">
        <div class="content">
        <span class="label header">{estate.label}</span>
            <span class="adress header">{estate.adress.city.ru[0].toUpperCase()+estate.adress.city.ru.slice(1)+ (estate.adress.street.ru ? `, ${estate.adress.street.ru}` : "") + (estate.adress.estateNumber ?  `, дом ${estate.adress.estateNumber}` : "")}</span>
            <div class="price-wrapper" title={priceInWords}>
                <span class="price">{currencyCalculator(estate.price, $currencyOnPage, estate.currency, $changeRates)}</span><span class="price-currency">&nbsp{$currencyOnPage === "USD" ? "$" : $currencyOnPage === "EUR" ? "€" : "₴"}{estate.deal === "lease" ? " / месяц" : ""}</span>
            </div>
                
            <div class="sq">
                <span class="sq-header header">Площадь</span>
                <div class="prop" >
                    <span class="prop-label">Общая</span>
                    <span class="value-label">{estate.details.area.g}<sup><small>2</small></sup></span>
                </div>
                {#if estate.details.area.l}
                    <div class="prop" >
                        <span class="prop-label">Жилая</span>
                        <span class="value-label">{estate.details.area.l}<sup><small>2</small></sup></span>
                    </div>
                {/if}
                {#if estate.details.area.k}
                    <div class="prop">
                        <span class="prop-label">Кухня</span>
                        <span class="value-label">{estate.details.area.k}<sup><small>2</small></sup></span>
                    </div>
                {/if}
            </div>
            <div class="sq">
                <span class="sq-header header">{estate.type === "flat" ? "Квартира" : estate.type === "house" ? "Дом" : estate.type === "commersion" ? "Объект" : "Участок"}</span>
                <div class="prop">
                    <span class="prop-label">Комнаты</span>
                    <span class="value-label">{estate.details.rooms}</span>
                </div>
                <div class="prop">
                    <span class="prop-label header">{estate.type === "flat" || estate.type === "commersion"? "Этаж" : "Этажность"}</span>
                    <span class="value-label">{estate.type === "flat" || estate.type === "commersion" ?
                         `${estate.details.floor + estate.details.gfloor ? estate.details.gfloor : ""}` : `${estate.details.gfloor}`}
                    </span>
                    </div>
                    {#if estate.details.state}
                        <div class="prop">
                            <span class="prop-label header">Состояние</span>
                            <span class="value-label">{estate.details.state === false ? "Вторичка" : "Новое"}</span>
                        </div>
                    {/if}
                </div>
                {#if estate.extras.metro || estate.details.zk || estate.type === "commersion"}
                <div class="sq-vertical">
                    <span class="sq-header header">Расположение</span>
                    {#if estate.extras.metro}
                    <div class="prop-vertical">
                        <span class="prop-label-vertical header">Метро</span>
                        <span class="value-label-vertical">{estate.extras.metro.distance ? estate.extras.metro.ru + `, в ${estate.extras.metro.distance}м` : estate.extras.metro.ru}</span>
                    </div>
                    {/if}
                    {#if estate.details.zk}
                    <div class="prop-vertical">
                        <span class="prop-label-vertical header">Жилой комплекс</span>
                        <span class="value-label-vertical">{estate.details.zk.ru}</span>
                    </div>
                    {/if}
                    {#if estate.type === "commersion"}
                    <div class="prop-vertical">
                        <span class="prop-label-vertical header">Фонд</span>
                        <span class="value-label-vertical">{estate.details.fond === false ? "Нежилой" : "Жилой"}</span>
                    </div>
                    {/if}
                </div>
                {/if}
            </div>
            <div class="question-box">
                <div class="question header">Понравилась квартира или есть вопросы?</div>
                <div class="answer">
                    <span class="contact-href header">Свяжитесь с нами</span><span class="or header">&nbspили&nbsp</span>
                    <a style="text-decoration: none;" rel=prefetch href={`/${estate.type}/${estate._id}`}>
                        <div class="details-show-button">
                            детали
                        </div>
                    </a>
                   
                </div>
            </div>   
    </div>
</div>
</div>