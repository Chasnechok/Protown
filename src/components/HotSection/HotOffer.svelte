<script>
    import Carousel from '@beyonk/svelte-carousel';
    import ImagePlaceholder from "../../helpers/ImagePlaceholder.svelte";
    import { changeRates, currencyOnPage } from "../../helpers/parametres";
    import { currencyCalculator } from "../../helpers/converter";
    import { numberToPhrase } from "../../helpers/numToString";
    export let estate;

    const images = estate.images[0] ? estate.images.map(el => `https://www.dropbox.com/s/${el}?raw=1`) : undefined;
    $: priceInWords = numberToPhrase($currencyOnPage, estate.price);
    //console.log(estate);

   
</script>

<style>
    .hot-offer-wrapper {
        background-color: transparent;
        padding: 3px 1em;
        margin: 0 auto;
        max-width: 900px;
        min-height: 650px;
        position: relative;
        min-height: 620px;
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
    .left { 
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 1em 1em 1em 0;
        max-width: 60%;
        flex: 0 0 60%;
    }
    .right {
        display: flex;
        flex-direction: column;
        padding: 1em;
        justify-content: space-between;
        flex: 0 0 40%;
    }
    .main-image {
        width: 100%;
        margin: auto;
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
    .value-label{
        color: black;
    }
    .prop{
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
    .contact-href{
        font-size: var(--answerFontSize, 14px);
        font-weight: 600;
        color: #6262DB;
    }
    .details-show-button{
        color: white;
        text-align: center;
        padding: 0.5em 1em;
        background: rgba(98, 98, 219, 0.8);
        border-radius: 10px;
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
    .main-image .image-wrapper {
        max-height: 100%;
        max-width: 100%;
        overflow: hidden;
        position: relative;
        border-radius: .3em;
        display: flex;
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
        padding: 1em;
        background-color: white;
        box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.15);
        width: 100%;
        border-radius: .3em;
        flex-direction: column;
    }
    .hot-offer-ms .props-wrapper {
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
    }
    .hot-offer-ms .props-wrapper .main-prop {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        font-size: 14px;
        font-weight: 500;
        text-transform: uppercase;
        color: rgba(0, 0, 0, 0.5);
    }
    .hot-offer-ms .main-prop .deal, .hot-offer-ms .main-prop .fee {
        display: flex;
        align-items: center;
    }
    .hot-offer-ms .main-prop .deal::before, .hot-offer-ms .main-prop .fee::before {
        content: "";
        width: 8px;
        height: 8px;
        display: block;
        border-radius: 50%;
        background-color: rgba(0, 0, 0, 0.5);
        margin: 0 1em;
    }
    .hot-offer-ms .estate-label-header {
        text-align: center;
        font-size: 18px;
        font-weight: bold;
        margin-top: .2em;
        color: #2c3e50;
    }
    .hot-offer-ms .estate-label-adress {
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
   
    .hot-offer-ms .estate-price-wrapper {
        display: flex;
        align-items: center;
        margin-top: .5em;
        cursor: default;
    }
    .hot-offer-ms .estate-price-wrapper .price {
        font-weight: 500;
    }
    
    @media only screen and (min-width: 1650px) {
        .hot-offer-wrapper {
            max-width: 1000px;
        }
        .left {
            flex: 0 0 70%;
            max-width: 70%;
        }
        .right {
            flex: 1 0 30%;
        }
        .image-wrapper {
            max-width: 478px !important;
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
    @media only screen and (min-width: 1650px) {
        .hot-offer-l .left {
            flex: 0 0 65%;
            max-width: 65%;
        }
    }

    @media only screen and (max-width: 768px) {
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
        .left, .right {
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
    @media only screen and (max-width: 375px) {
        .hot-offer-ms .props-wrapper {
            padding: .5em 1em;
        }
        .hot-offer-ms .props-wrapper .main-prop {
            font-size: 12px;
        }
        .hot-offer-ms .estate-label-header {
            font-size: 14px;
            text-align: initial;
        }
    }
    @media only screen and (max-width: 325px) {
        .hot-offer-ms .main-prop .deal::before, .hot-offer-ms .main-prop .fee::before {
            margin: 0 .5em;
            width: 5px;
            height: 5px;
        }
    }

    

    
</style>

<div class="hot-offer-wrapper">

<div class="hot-offer-ms">
    <div class="props-wrapper">
        <div class="main-prop">
            <div class="type">{estate.type === "house" ? "Дом" : estate.type === "flat" ? "Квартира" : estate.type === "land" ? "Участок" : "Коммерция"}</div>
            <div class="deal">{estate.deal === "buy" ? "Продажа" : "Аренда"}</div>
            {#if estate.extras.fee === false}
                <div class="fee">0% комиссии</div>
            {/if}
        </div>
        <div class="estate-label">
            <div class="estate-label-header">{estate.label}</div>
            <div class="estate-label-adress">
                {estate.adress.city.ru[0].toUpperCase()+estate.adress.city.ru.slice(1)+ (estate.adress.street.ru ? `, ${estate.adress.street.ru}` : "")+(estate.adress.estateNumber ?  `, дом ${estate.adress.estateNumber}` : "")}
            </div>
            <div class="estate-price-wrapper" title={priceInWords}>
                <span class="price">{currencyCalculator(estate.price, $currencyOnPage, estate.currency, $changeRates)}</span><span class="price-currency">&nbsp{$currencyOnPage === "USD" ? "$" : $currencyOnPage === "EUR" ? "€" : "₴"}{estate.deal === "lease" ? " / месяц" : ""}</span>
            </div>
        </div>
    </div>
    <div class="images-wrapper-ms">
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
        
    </div>
</div>

<div class="hot-offer-l">
    {#if estate.extras.fee === false}
        <div class="zero-fee">
            <span>0% комиссии</span>
        </div>
    {/if}
    {#if images}
    <div class="left">
        <div class="main-image">
            <Carousel controls={false} perPage={1} > 
                {#each images as image,i}
                    <div class="image-wrapper">
                        <ImagePlaceholder
                        url={image} alt={`estateImage ${i}`}
                        imageMaxHeight="100%"
                        imageMaxWidth="100%"
                        placeholderHeight="370px"
                        styling="border-radius: .3em; display: block; object-fit: contain; margin: auto;"
                        />
                    </div>
                {/each}
            </Carousel>
        </div>
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
                    <div class="details-show-button">
                        детали
                    </div>
                </div>
            </div>   
    </div>
</div>
</div>