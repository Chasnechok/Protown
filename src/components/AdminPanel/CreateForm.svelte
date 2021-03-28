<script>
    import { createBlankEstate, daysOfWeek, monthsOfYear, currencyCalculator } from "../../helpers/converter";
    import axios from "axios";
    import { countries1, kyivDistricts } from "../../helpers/locations";
    import { slide } from 'svelte/transition';
    import Datepicker from 'svelte-calendar';
    import Select from 'svelte-select';
    import { tooltip } from '../../helpers/tooltip';
    let estateTemplate = createBlankEstate();
    let selectedDate, cityLabel, districtIdx, districtSelector, estateNumberInput, streetSelector, estateNumberActive = false; 
    $: userWillSelectDate = estateTemplate.realised?false:false;
    export let visikom;
    const getOptionLabel = (option) => {
        if(option.properties){
            if(option.properties.categories === "adr_street"){
                return option.properties.type +" "+ option.properties.name+" "+(option.properties.zone ? `(${option.properties.zone} район)` : "");
            }
            else{
               return option.properties.name + (option.properties.level1 ? ", " + option.properties.level1 : "");
            }
        }
        else {
            return option.label;
        }
    };
    const getSelectionLabel = (option) => getOptionLabel(option);
    const optionIdentifier = "id";
    const handleCountrySelect = (detail) => {
        estateTemplate.adress.country = detail.value;
        handleClear("country");
    }
    const handleCitySelect = (detail) =>{
        cityLabel = detail.properties.type.charAt(0).toUpperCase() +  detail.properties.type.slice(1);
        estateTemplate.adress.city.ru = detail.properties.name;
        handleClear("city");
    }
    const handleStreetSelect = (detail) =>{
        estateTemplate.adress.street.ru = detail.properties.name;
        if(detail.properties.name_en){
            estateTemplate.adress.street.en = detail.properties.name_en;
        }
        if(detail.properties.zone){
            console.log(detail.properties.zone);
            estateTemplate.adress.district = kyivDistricts.find(el=> el.label.toLowerCase() === detail.properties.zone.toLowerCase());
            districtIdx = kyivDistricts.map(el => el.label.toLowerCase()).indexOf(detail.properties.zone.toLowerCase());
        }else{
            estateTemplate.adress.district = null;
        }
    }
    const handleDistrictSelect = (detail) =>{
        estateTemplate.adress.district = detail.value;
    }
    const handleClear = (from) => {
        estateTemplate.adress.street.ru = undefined;
        estateTemplate.adress.estateNumber = undefined;
        if(districtSelector)districtSelector.handleClear();
        if(from === "city"){
            if(streetSelector)streetSelector.handleClear();
            estateTemplate.adress.district = undefined;
            estateNumberActive = false;
        }
        if(from === "country"){
            estateNumberActive = false;
            estateTemplate.adress.city.ru = undefined;
        }
        if(from === "street"){
            estateTemplate.adress.district = undefined;
        }
    }
    const loadStreetsAsync = (filterText) => {
    return new Promise((resolve, reject) => {
      axios.get(`https://api.visicom.ua/data-api/4.0/ru/search/adr_street.json?text=Украина,%20${city.ru},%20${filterText}&key=${visikom}`)
      .then(response => resolve(response.data.type === "Feature" ? [response.data] : response.data.features.filter(street => street.properties.settlement === city.ru)))
      .catch(err => reject(err.response))
    });
    }
    const loadCitiesAsync = (filterText) => {
    return new Promise((resolve, reject) => {
      axios.get(`https://api.visicom.ua/data-api/4.0/ru/search/adm_settlement.json?text=Украина,%20${filterText}&key=${visikom}`)
      .then(response => resolve(response.data.type === "Feature" ? [response.data] : response.data.features))
      .catch(err => reject(err.response))
    });
    }
</script>

<style>
    .create-form-wrapper {
        padding: 2em 1em;
    }
    .create-form {
        border: 1px solid #e2e2e2;
        box-shadow: inset 0px 0px 6px rgb(0 0 0 / 15%);
        padding: 1em 2em;
        border-radius: .5em;
        max-width: 900px;
        margin: 0 auto;
    }
    .create-form >*:not(:first-child) {
        margin-top: 1em;
    }
    .prop-vertical {
        display: flex;
        flex-direction: column;
    }

    input {
        color: #828282;
        font-size: 16px;
        padding: 0.5em;
        border: 0 solid #a9a9a9;
        border-radius: 5px 5px 2px 2px;
        background-color: #e5e5e56b;
        border-bottom: 2px solid #a9a9a9;
        max-width: 100%;
    }
    label, h3 {
        margin: 0;
        padding: 0;
        margin-bottom: .25em;
        font-size: 18px;
        letter-spacing: .5px;
    }
    input:focus {
        border: 0;
        outline: none;
        border-bottom: 2px solid #6262db;
        color: #676784;
    }

    .options-horizontal {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
    }
    .options-horizontal > * {
        margin: .5em;
    }
    button {
        border-radius: .5em;
        text-align: center;
        padding: 0.6em 1em;
        transition: .3s;
        border: 1px solid #a9a9a9;
        display: block;
        color: #464646;
        background: transparent;
        min-width: 195px;
    }
    button:focus {
        outline: 0 !important;
    }
    button:hover:not(.active), button:focus:not(.active) {
        cursor: pointer;
        letter-spacing: 1px;
        border-color: #6262db;
        color: #6262db;
    }
    button.active {
        border-color: #6262db;
        color: #6262db;
    }

    .realised-option {
        margin-top: .5em;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
    }
    .realised-option input {
        margin-right: 1em;
        margin-left: .5em;
        height: 1em;
        width: 1em;
        cursor: pointer;
    }
    .realised-option label, .realised-option span, .realised-option svg {
        color: #a9a9a9;
        transition: .3s;
        margin-bottom: 0;
    }
    .realised-option label.active, .realised-option span.active, .realised-option svg.active {
        color: #333;
    }
    .price-input-wrapper.postfix-month::after{
        content: " / месяц";
        font-size: 12px;
        position: absolute;
        right: .5em;
        top: 50%;
        transform: translateY(-50%);
    }
    svg {
        width: 1.5em;
        height: 1.5em;
        margin: 0 1em;
    }
    .date-picker-wrapper {
        padding: 0.5em;
    }

    @media only screen and (max-width: 940px) {
        label, h3 {
            text-align: center;
        }
        .options-horizontal, .realised-option {
            justify-content: center;
        }
    }
    @media only screen and (max-width: 400px) {
        .create-form-wrapper {
            padding: 2em 0;
        }
        .create-form {
            border-radius: 0;
            padding: 1em 0;
        }
    }
</style>

<div class="create-form-wrapper">
    <form class="create-form" on:submit|preventDefault >
        <div class="prop prop-vertical">
            <label for="estate-label">Название</label>
            <input id="estate-label" type="text" required>
        </div>
        <div class="prop prop-vertical">
            <h3>Тип недвижимости</h3>
            <div class="options-horizontal">
                <button type="button" class:active={estateTemplate.type==="flat"} on:click={()=>estateTemplate.type="flat"}>Квартира</button><button type="button" class:active={estateTemplate.type==="house"} on:click={()=>estateTemplate.type="house"}>Дом</button>
                <button type="button" class:active={estateTemplate.type==="land"} on:click={()=>estateTemplate.type="land"}>Участок</button><button type="button" class:active={estateTemplate.type==="commersion"} on:click={()=>estateTemplate.type="commersion"}>Коммерция</button>
            </div>
        </div>
        <div class="prop prop-vertical">
            <h3>Тип сделки</h3>
            <div class="options-horizontal">
                <button type="button" class:active={estateTemplate.deal==="buy"} on:click={()=>{estateTemplate.deal="buy"; estateTemplate.realised=false;}}>Продажа</button><button type="button" class:active={estateTemplate.deal==="lease"} on:click={()=>estateTemplate.deal="lease"}>Аренда</button>
            </div>
            {#if estateTemplate.deal==="lease"}
            <div in:slide class="option-horizontal realised-option">
                <input type="checkbox" bind:checked={estateTemplate.realised} id="realised">
                <label class:active={estateTemplate.realised} for="realised">Уже сдано</label>
                <svg style="cursor: {estateTemplate.realised?"pointer":"default"}" on:click={()=>estateTemplate.realised?userWillSelectDate=!userWillSelectDate:null} class:active={userWillSelectDate} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <span class:active={userWillSelectDate}>&nbsp;и освобождается&nbsp;</span>
                <div class="date-picker-wrapper" style="pointer-events: {userWillSelectDate?"auto":"none"};" >
                    <Datepicker buttonTextColor={userWillSelectDate?"#333":"#a9a9a9"} highlightColor='#6262db' start={new Date()} {daysOfWeek} {monthsOfYear} bind:selected={selectedDate}/>
                </div>
            </div>
            {/if}
        </div>
        <div style="padding-bottom: 1em;" class="prop prop-vertical">
            <label for="price">Цена</label>
            <div class="options-horizontal">
                <Select containerClasses="currency-select" items={["UAH", "USD", "EUR"]} isClearable={false} isSearchable={false} selectedValue={estateTemplate.currency} on:select={({detail})=>estateTemplate.currency=detail.value} />
                <div style="position: relative;" class="price-input-wrapper" class:postfix-month={estateTemplate.deal === "lease"}>
                    <input id="price" required min="1" type="number" bind:value={estateTemplate.price}>
                </div>
                <span title="Цены в других валютах высчитываются основываясь на курсы ПриватБанка" use:tooltip style="cursor: help; display: flex; align-items: center;">
                    &nbsp;Привязано к {estateTemplate.currency}&nbsp;
                    <svg style="pointer-events: none;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </span>
            </div>
        </div>
        <!-- 
            ADDRES
         -->
        <div class="prop prop-vertical">
            <h3 style="border-top: 1px dashed #333;padding-top: 1.5em;">Страна</h3>
            <Select containerClasses="country-select" items={countries1} isClearable={false} isSearchable={false} selectedValue={countries1[0]} on:select={({detail})=>handleCountrySelect(detail)} />
        </div>
        <div class="prop prop-vertical">
            <h3>Город</h3>
            {#if estateTemplate.adress.country === "UA"}
                <Select hideEmptyState placeholder="Введите название населенного пункта..." loadOptions={loadCitiesAsync} {optionIdentifier} {getSelectionLabel} {getOptionLabel}  on:select={({detail}) => handleCitySelect(detail)} on:clear={()=> handleClear("city")}></Select>
            {:else}
            <input bind:value={estateTemplate.adress.city.ru} placeholder="Введите название населенного пункта..." type="text">
            {/if}    
        </div>
        <div class="prop prop-vertical">
            <h3>Улица</h3>
            <Select containerClasses="country-select" items={countries1} isClearable={false} isSearchable={false} selectedValue={countries1[0]} on:select={({detail})=>handleCountrySelect(detail)} />
        </div>
        
    </form>
</div>