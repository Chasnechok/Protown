<script>
    import Carousel from '@beyonk/svelte-carousel';
	import { ChevronLeftIcon, ChevronRightIcon } from 'svelte-feather-icons';
import { detach } from 'svelte/internal';
    
    export let estate;
    const imgArr = estate.images.map(el => `https://www.dropbox.com/s/${el}?raw=1`)
    let currentImg = imgArr[1];
    console.log(estate);
</script>

<style>

    .main-hot-card-wrapper{
        --headerFontSize: 18px;
        --addressFontSize: 12px;
        --answerFontSize: 12px;
        --minFontSize: 12px;
        --questionFontSize: 12px;
    }
    .main-hot-card-wrapper{
        background: #FFFFFF;
        box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.25);
        border-radius: 10px;
        display: grid;
        grid-template-columns: 60% 40%;
        grid-template-rows: 80% 20%;
        height: 525px;
        padding: 1em 0;
    }

    .carousel-mini{
        align-self: center;
        grid-row: 2;
        padding: 1em 3em;
    }
    .main-image-wrapper{
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .slide-content{
        padding-top: 0.5em;
    }
    .image-small{
        box-sizing: border-box;
        border: 2px solid #FFFFFF;
        box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.45);
        border-radius: 5px;
    }
    .main-image{
        border: 2px solid #FFFFFF;
        box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.45);
        border-radius: 10px;
    }
    .description{
        grid-column: 2;
        grid-row: 1/3;
        display: flex;
        justify-content: center;
        flex-direction: column;
        margin-right: 2em;
    }
    .description .label{
        font-weight: bold;
        font-size: var(--headerFontSize);
        line-height: 100%;
    }
    .description .adress{
        font-weight: bold;
        font-size: var(--adressFontSize);
        color: rgba(0, 0, 0, 0.5);
    }
    .price-wrapper{
        background: #E5E5E5;
        border-radius: 10px;
        width: 100%;
        padding: 0.5em 0;
        text-align: center;
    }
    .price, .price-currency{
        font-weight: bold;
        font-size: 18px;
        line-height: 100%;
    }
    .price-currency{
        color: rgba(98, 98, 219, 0.8)
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
    .question, .main-hot-card-wrapper, .sq-vertical, .sq, .price-wrapper {
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
        font-size: var(--answerFontSize);
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

    @media only screen and (max-width: 1650px) {
    .main-hot-card-wrapper{
        --headerFontSize: 18px;
        --addressFontSize: 12px;
        --answerFontSize: 12px;
        --minFontSize: 12px;
        --questionFontSize: 12px;
    }
    }

</style>


        <div class="main-hot-card-wrapper">
            <div class="main-image-wrapper">
                <img class="main-image" height="90%" width="90%" src={currentImg} alt={"Main image on top section"} >
            </div>
            <div class="carousel-mini">
                <Carousel dots={false} perPage={3} on:change={({detail}) => {
                currentImg = imgArr[detail.currentSlide == -1 || detail.slideCount - detail.currentSlide == 1 ? 0 :
                detail.currentSlide == -2 ? imgArr.length -1 : detail.currentSlide +1 ];
                }}>
                
                {#each imgArr as img, i}
                <div class="slide-content" style={`width: 140px; height: 100px;`}>
                    <img class="image-small" src={img} alt={`Image ${i}`} width={140} height={100} />
                </div>
                
                {/each}
              
                  </Carousel>
            </div>
            <div class="description">
                <span class="label">{estate.label}</span>
                <span class="adress">{estate.adress.city.ru + (estate.adress.street.ru ? `, ${estate.adress.street.ru}` : "" + estate.adress.estateNumber ?  `, дом ${estate.adress.estateNumber}` : "")}</span>
                <div class="price-wrapper">
                    <span class="price">{estate.deal === "sell" ? estate.price : `${estate.price} / месяц`}</span><span class="price-currency">&nbspгривен</span>
                </div>
                
                <div class="sq">
                    <span class="sq-header">Площадь</span>
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
                    <span class="sq-header">{estate.type === "flat" ? "Квартира" : estate.type === "house" ? "Дом" : estate.type === "commersion" ? "Объект" : "Участок"}</span>
                    <div class="prop">
                        <span class="prop-label">Комнаты</span>
                        <span class="value-label">{estate.details.rooms}</span>
                    </div>
                    <div class="prop">
                        <span class="prop-label">{estate.type === "flat" || estate.type === "commersion"? "Этаж" : "Этажность"}</span>
                        <span class="value-label">{estate.type === "flat" || estate.type === "commersion" ?
                         `${estate.details.floor + estate.details.gfloor ? estate.details.gfloor : ""}` : `${estate.details.gfloor}`}</span>
                    </div>
                    {#if estate.details.state}
                    <div class="prop">
                        <span class="prop-label">Состояние</span>
                        <span class="value-label">{estate.details.state === false ? "Вторичка" : "Новое"}</span>
                    </div>
                    {/if}
                </div>
                {#if estate.extras.metro || estate.details.zk || estate.type === "commersion"}
                <div class="sq-vertical">
                    <span class="sq-header">Расположение</span>
                    {#if estate.extras.metro}
                    <div class="prop-vertical">
                        <span class="prop-label-vertical">Метро</span>
                        <span class="value-label-vertical">{estate.extras.metro.distance ? estate.extras.metro.ru + `, в ${estate.extras.metro.distance}м` : estate.extras.metro.ru}</span>
                    </div>
                    {/if}
                    {#if estate.details.zk}
                    <div class="prop-vertical">
                        <span class="prop-label-vertical">Жилой комплекс</span>
                        <span class="value-label-vertical">{estate.details.zk.ru}</span>
                    </div>
                    {/if}
                    {#if estate.type === "commersion"}
                    <div class="prop-vertical">
                        <span class="prop-label-vertical">Фонд</span>
                        <span class="value-label-vertical">{estate.details.fond === false ? "Нежилой" : "Жилой"}</span>
                    </div>
                    {/if}
                </div>
                {/if}
                <div class="question">Понравилась квартира или есть вопросы?</div>
                <div class="answer">
                    <span class="contact-href">Свяжитесь с нами</span><span class="or">&nbspили откройте&nbsp</span>
                    <div class="details-show-button">
                        детали
                    </div>
                </div>
            </div>
        </div>
