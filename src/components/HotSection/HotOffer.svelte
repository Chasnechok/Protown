<script>
    import { Swiper, SwiperSlide } from 'swiper/svelte';
	import SwiperCore, { Navigation, Pagination, Lazy, A11y } from 'swiper';
    SwiperCore.use([Navigation, Pagination, Lazy, A11y]);
    import 'swiper/swiper-bundle.min.css';
    import { currencyOnPage } from "../../helpers/parametres";
    import { currencyCalculator } from "../../helpers/converter";
    import { onMount, getContext } from "svelte";
    import dayjs from "dayjs";
    export let estate;
    let mounted;
    const { courses: changeRates } = getContext("changeRates");
    onMount(()=>mounted=true)

    const images = estate.images && estate.images[0] ? estate.images.map((el,i) => ({id:i, src:`https://assets.protown.in.ua/estates/${estate.type}/${estate._id}/${el}`})) : undefined;
    const num = new Intl.NumberFormat("en-US");
    $: priceInWords = num.format(currencyCalculator(estate.price, $currencyOnPage, estate.currency, changeRates));
    //console.log(estate);

   
</script>

<style>
    .hot-offer-wrapper {
        max-width: 920px;
        margin: 0 auto;
        padding: 1em .5em;
    }
    .hot-offer {
        background-color: #fff;
        padding: 1em;
        position: relative;
        display: flex;
        flex-wrap: wrap;
        border-radius: .3em;
        box-shadow: 0px 0px 6px rgb(0 0 0 / 25%);
        justify-content: center;
        align-items: center;
        overflow: hidden;
    }
    .hot-offer:hover .hide-screen {
        transform: translateY(-100%);
    }
    h3.estate-label, h4 {
        flex: 1 1 100%;
        text-align: center;
        margin: 0;
    }
    .labels {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        flex: 1 1 100%;
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
    .images-wrapper {
        border-radius: .3em;
        height: 400px;
        width: 600px;
        --swiper-theme-color: #6262DB;
        /* --swiper-navigation-color: #333; */
        position: relative;
        margin-right: 1em;
    }

    .estate-image-lazy {
        width: 100%;
        height: 400px;
        border-radius: .5em;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
    }
    .properties-wrapper {
        flex: 1;
        position: relative;
        height: 400px;
    }

    .props {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
    }
    .price-wrapper {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        padding: .5em;
        background-color: #efefef;
        border-radius: .5em;
    }
    fieldset {
        border: none;
        border-top: 1px solid #333;
        line-height: 19px;
        margin-bottom: 1em;
    }
    fieldset > div > div:not(:last-child) {
        margin-bottom: .3em;
    }
    legend {
        margin: 0 auto;
        padding: .5em;
    }
    .prop-wrapper {
        display: flex;
        align-items: baseline;
    }
    .prop-wrapper > * {
        flex: 1;
    }
    .prop-label {
        text-align: end;
        margin-right: 1em;
        color: #5a5a5a;
    }
    a {
        text-decoration: none;
        border-radius: .5em;
        text-align: center;
        padding: 0.3em 1em;
        transition: .3s;
        border: 1px solid #a9a9a9;
        display: block;
        color: #464646;
        background: transparent;
        width: 100%;
        cursor: pointer;
    }
    a:hover, a:active, a:focus {
        letter-spacing: 1px;
        border-color: #6262db;
        color: #6262db;
    }
    :global(.swiper-pagination) {
        bottom: 0 !important;
    }

    @media only screen and (max-width: 1649px) {
        .images-wrapper {
            width: 450px;
        }
        .estate-image-lazy, .images-wrapper, .properties-wrapper {
            height: 338px;
        }
    }

    @media only screen and (max-width: 1365px) {
        .images-wrapper {
            width: 600px;
        }
        .estate-image-lazy, .images-wrapper, .properties-wrapper {
            height: 400px;
        }
    }

    @media only screen and (max-width: 820px) {
        .estate-image-lazy, .images-wrapper, .properties-wrapper {
            height: 350px;
        }
        .images-wrapper {
            width: 500px;
        }
    }

    @media only screen and (max-width: 694px) {
        .hot-offer {
            flex-direction: column;
            max-width: 450px;
            margin: 0 auto;
        }
        .properties-wrapper {
            height: initial;
            width: 100%;
        }
        .estate-image-lazy, .images-wrapper {
            height: 300px;
        }
        .images-wrapper {
            width: 100%;
            margin-right: 0;
            margin-bottom: 1em;
        }
        .price-wrapper {
            margin-bottom: 1em;
        }
        legend {
            padding: 0 1.5em;
        }
    }
    @media only screen and (max-width: 375px) {
        .estate-image-lazy, .images-wrapper {
            height: 220px;
        }
    }

</style>
<div class="hot-offer-wrapper">
    <div class="hot-offer">
        {#if !estate.isHidden&&estate.realised&&(isNaN(Date.parse(estate.realised))||dayjs(estate.realised).isAfter(dayjs()))}
        <div class="hide-screen realised">
            <div class="hide-screen-content">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{
                !isNaN(Date.parse(estate.realised))?
                dayjs(estate.realised).format('DD/MM/YYYY'):
                "Не указано"
                }
                </span>
            </div>
        </div>
        {/if}
        <h3 class="estate-label">{estate.label}</h3>
        {#if estate.adress.city}
            <h4 class="adress">{(estate.adress.city.ru??"")+ (estate.adress.street ? `, ${estate.adress.street.ru}` : "") + (estate.adress.estateNumber ?  `, дом ${estate.adress.estateNumber}` : "")}</h4>
        {/if}
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
        <div class="images-wrapper">
            {#if estate.images && estate.images[0] && mounted}
            <Swiper
                spaceBetween={4}
                slidesPerView={1}
                speed={700}
                nested
                grabCursor
                navigation
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
                    <div data-background={estateImage.src} class="estate-image-lazy">
                        <div class="swiper-lazy-preloader"></div>
                    </div>
                </SwiperSlide>
                {/each}
            </Swiper>
    
            {:else}
            <div class="no-image" />
            {/if}
        </div>
        <div class="properties-wrapper">
            <div class="props">
                <div class="price-wrapper" title={priceInWords}>
                    <span class="price" >{currencyCalculator(estate.price, $currencyOnPage, estate.currency, changeRates)}</span><span class="price-currency">&nbsp{$currencyOnPage === "USD" ? "$" : $currencyOnPage === "EUR" ? "€" : "₴"}{estate.deal === "lease" ? " / месяц" : ""}</span>
                </div>
                <div class="areas">
                    {#if estate.details.area}
                    <fieldset class="area-field">
                        <legend>Площадь</legend>
                        <div class="area-poperties">
                            {#each Object.keys(estate.details.area) as areaProp}
                                <div class="prop-wrapper">
                                    <span class="prop-label">{areaProp === "g"?"Общая":areaProp === "l"?"Жилая":areaProp === "whole"? "Участок":"Кухня"}</span>
                                    <span class="prop-value">{estate.details.area[areaProp]}{#if areaProp!=="whole"}м<sup>2</sup> {:else}&nbspсоток{/if}</span>
                                </div>
                            {/each}
                        </div>
                    </fieldset>
                    {/if}
                    {#if estate.details.rooms||estate.details.gfloor||estate.details.floor||(estate.type==="land")}
                    <fieldset class="estate-field">
                        <legend>{estate.type==="flat"?"Квартира":estate.type==="house"?"Дом":estate.type==="commersion"?"Коммерция":estate.type==="land"?"Участок":"Бог знает что"}</legend>
                        <div class="estate-properties">
                            {#if estate.details.rooms}
                            <div class="prop-wrapper">
                                <span class="prop-label">Комнаты</span>
                                <span class="prop-value">{estate.details.rooms}</span>
                            </div>
                            {/if}
                            {#if estate.details.gfloor || estate.details.floor}
                            <div class="prop-wrapper">
                                <span class="prop-label">{!estate.details.floor && estate.details.gfloor? "Этажность" : "Этаж"}</span>
                                <span class="prop-value">
                                    {estate.details.floor && estate.details.gfloor ? estate.details.floor + " / " + estate.details.gfloor :
                                    estate.details.floor ? estate.details.floor : estate.details.gfloor ? estate.details.gfloor : "не указано"
                                    }
                                </span>
                            </div>
                            {/if}
                            {#if estate.type==="land"}
                            <div class="detail">
                                <span class="detail-label">{estate.deal==="lease"?"Аренда":"Покупка"}&nbsp;частями</span>
                                <span class="value-label">{estate.details.partly?"Да":"Нет"}</span>
                            </div>
                            {/if}
                        </div>
                    </fieldset>
                    {/if}
                </div>
                <a sapper:prefetch href="/{estate.type}/{estate._id}">детали</a>
            </div>
        </div>
    </div>
</div>