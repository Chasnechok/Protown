<script>
    import Carousel from '@beyonk/svelte-carousel';
    import ImagePlaceholder from "../../helpers/ImagePlaceholder.svelte";
    import { changeRates, currencyOnPage } from "../../helpers/parametres";
    import { currencyCalculator } from "../../helpers/converter";
    import { numberToPhrase } from "../../helpers/numToString";
    export let estate;
    const images = estate.images && estate.images[0] ? estate.images.map(el => `https://www.dropbox.com/s/${el}?raw=1`) : undefined;
    $: priceInWords = numberToPhrase($currencyOnPage, estate.price);
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
        height: 270px;
        width: 100%;
        margin-top: .5em;
        overflow: hidden;
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
        <div class="estate-label">
            <div class="estate-label-header">{estate.label ? estate.label : "Бог знает что"}</div>
            <div class="estate-label-adress">
                {estate.adress ? 
                estate.adress.city.ru[0].toUpperCase()+estate.adress.city.ru.slice(1)+ (estate.adress.street.ru ? `, ${estate.adress.street.ru}` : "")+(estate.adress.estateNumber ?  `, дом ${estate.adress.estateNumber}` : "")
            : 'Шевченко 48'}
            </div>
            <div class="estate-price-wrapper" title={priceInWords}>
                <span class="price">{currencyCalculator(estate.price, $currencyOnPage, estate.currency, $changeRates)}</span><span class="price-currency">&nbsp{$currencyOnPage === "USD" ? "$" : $currencyOnPage === "EUR" ? "€" : "₴"}{estate.deal === "lease" ? " / месяц" : ""}</span>
            </div>
        </div>
    </div>
    <div class="images-wrapper-ms">
        {#if images}
        <Carousel controls={false} perPage={1} > 
            {#each images as image,i}
            <div class="image-wrapper">
            <ImagePlaceholder
            url={image} alt={`estateImage ${i}`}
            imageHeight="270px"
            imageWidth="unset"
            placeholderHeight="270px"
            styling="border-radius: .3em; display: block; object-fit: contain; margin: 0 auto; "
            />
            </div>
            {/each}
        </Carousel>
        {:else}
        <div>
            <span>Изображений нет</span>
        </div>
        {/if}
    </div>
</div>