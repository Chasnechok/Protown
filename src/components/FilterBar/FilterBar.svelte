<script>
    import Select from 'svelte-select';
    import RangeSlider from "svelte-range-slider-pips";
    import { countries, obce, kyivDistricts } from "../../helpers/locations";
    import { BarLoader } from 'svelte-loading-spinners';
    import axios from "axios";
    import {onMount} from "svelte";
    import { slide } from 'svelte/transition';
    import { filters, items, noMore, extras, districtSelector } from "../../helpers/filterStore";
    import { changeRates } from "../../helpers/parametres";
    import { currencyCalculator } from "../../helpers/converter";
    const groupBy = (item) => item.group;
    const getSelectionLabel = (option) => option.label.replace("ий", "ом");
    let deals = [{value: "buy", label: "Купить"}, {value: "lease", label: "Арендовать"}];
    let types = [{value: "house", label: "Дом"}, {value: "flat", label: "Квартиру"}, {value: "commersion", label: "Коммерцию"}, {value: "land", label: "Участок"}];
    let selectedDistricts = [];
    $: filterBarExpanded = innerWidth&&innerWidth>=650?true:false;
    $: priceRangeMax = getPriceRangeMax(filtersProps, $filters.currency);
    const getPriceRangeMax = (filtersProps, ccy) => {
        if(!filtersProps||!$changeRates) return 99999999;
        const prices = [];
        for(let key in filtersProps){
            if(key==="maxUSD"||key==="maxEUR"||key==="maxUAH") prices.push({ccy: key.replace("max", ""), value: filtersProps[key]})
        }
        if(!prices[0]) return 99999999;
        const b = [];
        prices.forEach(price => {
            b.push(currencyCalculator(price.value, ccy, price.ccy, $changeRates))
        });
        return Math.max.apply(Math, b.map((el) => el));
    }
    let innerWidth;
    let extrasN = $extras;
    let filtersProps;
    onMount(()=>axios.get("/estates/getParametres").then(({data})=> {if(!filtersProps)filtersProps = data}));
    //$: if($filters) console.log($filters)
    

</script>

<style>
    .filter-bar-wrapper {
        margin: 0 auto;
        min-width: 100%;
        position: relative;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        justify-content: center;
        padding: 0 1em;
    }
    .filter-bar-wrapper h1 {
        text-align: center;
        min-width: 26ch;
        position: relative;
    }
    .filter-bar-wrapper h1 span{
        position: relative;
        display: inline-block;
        text-transform: lowercase;
        box-shadow: 0 4px rgb(98 98 219 / 90%);
    }
    .loading-filter-props {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: default;
        z-index: 100;
        background-color: transparent;
    }
    .filter-bar-l {
        background-color: white;
        border-radius: .3em;
        box-shadow: inset 0px 0px 6px rgba(0, 0, 0, 0.15);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 1em;
        --indicatorColor: rgb(98 98 219 / 90%);
        --placeholderColor: #2c3e50;
        border: 1px solid #e2e2e2;
        flex: 1 1 60%;
        max-width: 800px;
        position: relative;
        min-height: 410px;
    }

    .location-selector :global(.selectContainer:hover), .location-selector :global(input:hover), .range-selector span:not(:first-child):not(.active) {
        cursor: pointer;
    }
   
    .location-selector {
        margin-top: 1em;
        display: flex;
        flex-wrap: wrap;
        --border: none;
        --itemIsActiveBG: rgb(98, 98, 219, 0.9);
        --itemHoverBG: rgb(98, 98, 219, 0.1);
        --padding: 0 10px;
        --multiItemPadding: 0 7px 0 7px;
        --multiItemBG: none;
        --multiItemActiveBG: rgb(98, 98, 219, 0.9);
        --multiClearHoverFill: rgb(98, 98, 219, 0.9);
        --inputFontSize: 16px;
        --multiSelectPadding: 0 0 0 16px;
    }

    .location-selector span {
        display: flex;
        align-items: center;
        font-size: 18px;
    }

    .location-selector span:last-child {
        align-items: baseline;
    }

    .location-selector :global(.selection) {
        color: rgb(98, 98, 219);
    }
    .location-selector :global(.multiSelectItem_label){
        font-size: 14px;
    }
    .location-selector :global(.selectContainer > div:last-child:not(.indicator)) {
        z-index: 4 !important;
        font-size: 16px;
    }
    .range-selector {
        --range-handle-focus: rgb(98 98 219 / 90%);
        margin-top: 1em;
    }
    .range-selector span:first-child, span.active {
        font-size: 18px;
        color: #252525;
    }
    .range-selector span:not(:first-child):not(.active){
        color: #AAAAAA;
        font-weight: 300;
        font-size: 14px;
    }
    .extras-selector {
        margin-top: 1em;
    }
    .extras-selector > span {
        font-size: 18px;
    }
    .extras-selector .checkboxes-group {
        display: flex;
        flex-wrap: wrap;
    }
    .extras-selector .checkbox-wrapper {
        flex: 1 0 50%;
        display: flex;
        align-items: center;
    }
    .extras-selector .checkbox-wrapper > label {
        transition: 400ms;
        margin-right: 8px;
    }
    .controls {
        display: flex;
        margin-top: 1.5em;
        position: relative;
        justify-content: center;
        margin-bottom: 1em;
    }
  
    .controls button {
        padding: 1em 2em;
        border: none;
        transition: .5s;
        border-radius: .5em;
        font-size: 16px;
    }
    .controls button:hover {
        cursor: pointer;
        transform: scaleX(1.1);
    }
    .controls button:first-child {
        color: #AAAAAA;
    }
    .controls button:last-child {
        background-color: rgb(98, 98, 219, 0.9);
        color: white;
    }
    .line1 {
        margin-top: 0 !important;
    }

    .location-selector {
        justify-content: center;
    }
    .location-selector :global(.selection) {
        color: #2c3e50;
        font-weight: bold;
        font-size: 18px;
    }
    .line2 > div {
        display: flex;
        --indicatorRight: 0 !important;
    }
    .line2 :global(input) {
        max-width: 130px;
    }
    .range-selectors {
        display: flex;
        width: 100%;
        justify-content: center;
        flex-wrap: wrap;
        gap: 1em;
    }
    .range-selector {
        flex: 0 0 25%;
        min-width: 200px;
    }
    .range-selector > span:first-child, .extras-selector > span {
        font-weight: bold;
    }
    .extras-selector {
        text-align: center;
        width: 100%;
    }
    .checkboxes-group {
        justify-content: center;
        gap: 1em;
    }
    .checkbox-wrapper {
        flex: unset !important;
    }
    .controls {
        justify-content: center;
        margin-bottom: 1em;
    }
    .controls > button:first-child {
        background: transparent;
    }
    .controls > button {
        padding: .5em 2em;
    }
    .location-selector > * {
        transition: .7s;
    }
    .filters-close-button, .filters-open-button {
        display: none;
        cursor: pointer;
        position: absolute;
        height: 30px;
        width: 30px;
        bottom: 0;
        transform: translateY(50%);
    }

    @media only screen and (max-width: 1024px){
        .filter-bar-wrapper h1 {
            display: none;
        }
    }
    @media only screen and (max-width: 750px){
        .controls.filterBarNotExpanded {
            display: none;
        }
        .line2.filterBarExpanded, .line3.filterBarExpanded, .line4.filterBarExpanded, .filters-close-button.filterBarExpanded, .filters-open-button.filterBarNotExpanded {
            display: block;
        }
        .filter-bar-wrapper {
            padding: 0;
        }
        .filter-bar-wrapper .filter-bar-l{
            border-radius: 0;
            min-height: unset;
        }
    }


    @media only screen and (max-width: 375px) {
        .location-selector :global(.selection) {
            font-size: 14px;
        }
        .location-selector > span {
            font-size: 14px !important;
        }
    }

</style>
<svelte:window bind:innerWidth/>
<div class="filter-bar-wrapper" >
    <h1>Подберите себе <span>{types.find(v=>v.value===$filters.type)?.label}</span></h1>
    <div class="filter-bar-l">
        {#if !filtersProps}
        <div class="loading-filter-props">
            <BarLoader color="#d7dada"/>
        </div>
        {/if}
        <div style="opacity: {!filtersProps? "0":"1"};" transition:slide={{delay: 100}} class="line1 location-selector">
            <Select on:select={({detail})=>{$filters.deal=detail.value; extrasN = $extras; if(!filterBarExpanded) {$filters.isInitial=false; $items = []; $noMore = false}}} items={deals} isClearable={false} isSearchable={false} selectedValue={deals.find(v=>v.value===$filters.deal)} />
            <Select on:select={({detail})=>{$filters.type=detail.value; extrasN = $extras; if(!filterBarExpanded) {$filters.isInitial=false; $items = []; $noMore = false}}} items={types} isClearable={false} isSearchable={false} selectedValue={types.find(v=>v.value===$filters.type)} />
            <span>в <Select items={!filtersProps ? countries : countries.filter(el=>filtersProps.countries.indexOf(el.value)>=0)} isClearable={false} isSearchable={false} selectedValue={countries.find(el=> el.value === $filters.country)} on:select={({detail})=>{$filters.country=detail.value; if(!filterBarExpanded) {$filters.isInitial=false; $items = []; $noMore = false}}} /></span>
            <span>городе <Select {groupBy} items={!filtersProps ? obce : filtersProps.cities.map(el=> el.ru)} isClearable={false} isSearchable={false} selectedValue={$filters.city} on:select={({detail})=>{$filters.city=detail.value; if(!filterBarExpanded) {$filters.isInitial=false; $items = []; $noMore = false}}} /></span>
        </div>
        {#if filterBarExpanded}
        {#if $filters.city && $filters.city.toLowerCase() === "киев"}
            <div transition:slide class:filterBarExpanded class="line2 location-selector">
                <div>
                    <span style="font-size: 18px; font-weight: bold;">В</span>
                    <Select
                    noOptionsMessage="Вы выбрали все возможные районы"
                    selectedValue={selectedDistricts[0] && selectedDistricts}
                    isClearable={selectedDistricts[0] ? true : false} bind:this={$districtSelector}
                    showIndicator={!selectedDistricts[0] ? true : false} {getSelectionLabel}
                    isMulti {groupBy} items={kyivDistricts} placeholder="любом районе"
                    listPlacement="bottom" on:select={({detail})=> {
                        $filters.districts = detail??[];
                    }} />
                </div>
            </div>
        {/if}
        <div transition:slide class="range-selectors line3" class:filterBarExpanded>
            <div class="range-selector budget">
                <span>Бюджет</span>
                <RangeSlider step={10} formatter={ v => new Intl.NumberFormat("en-US").format(v) } float prefix={$filters.currency === "UAH" ? "₴" : $filters.currency === "EUR" ? "€" : "$"} max={priceRangeMax} range bind:values={$filters.price}  />
                <span style="cursor: default;">{$filters.price[0]} - {$filters.price[1]}&nbsp</span>
                <span on:click={()=>$filters.currency="USD"} class:active={$filters.currency==="USD"}>долларов&nbsp</span>
                <span on:click={()=>{$filters.currency="UAH"; $filters.price = [0, priceRangeMax]}} class:active={$filters.currency==="UAH"}>гривен&nbsp</span>
                <span on:click={()=>$filters.currency="EUR"} class:active={$filters.currency==="EUR"}>евро</span>
            </div>
            <div class="range-selector area">
                <span>Площадь</span>
                <RangeSlider step={2} float suffix="м²" min={!filtersProps ? 0 : filtersProps.minArea} max={!filtersProps ? 200 : filtersProps.maxArea} range bind:values={$filters.area}  />
                <span style="cursor: default;">{$filters.area[0]} - {$filters.area[1]}&nbspм<sup>2</sup></span>
            </div>
            <div class="range-selector rooms">
                <span>Количество комнат</span>
                <RangeSlider pips all='label' min={!filtersProps ? 1 : filtersProps.minRooms} max={!filtersProps ? 10 : filtersProps.maxRooms} range bind:values={$filters.rooms}  />
            </div>
        </div>
        <div transition:slide class="extras-selector line4" class:filterBarExpanded>
            <span>Дополнительно</span>
            <div class="checkboxes-group">
                {#each extrasN as val}
                <div class="checkbox-wrapper">
                    <label for="{val.label}" style={`color: ${val.c ? "black" : "#AAAAAA"};`}>{val.label}</label>
                    <input id="{val.label}" type="checkbox" bind:checked={val.c}>
                </div>
                {/each}
            </div>
        </div>
        <div transition:slide class="controls" class:filterBarNotExpanded={!filterBarExpanded} >
            <button on:click={()=>(filters.reset($districtSelector), $items = [], $noMore = false)}>Сбросить</button>
            <button on:click={()=> {
                $filters.isInitial = false;
                $filters.included = extrasN;
                $items = [];
                $noMore = false;
                let grid = document.getElementById("all-estates-section");
                grid.scrollIntoView({behavior: "smooth"});
            }}>Искать</button>
        </div>
        {/if}
        <div class="filters-close-button"  class:filterBarExpanded on:click={()=>filterBarExpanded=!filterBarExpanded}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clip-rule="evenodd" />
            </svg>
        </div>
        
        <div  class="filters-open-button" class:filterBarNotExpanded={!filterBarExpanded}> 
            <div transition:slide={{delay: 100}} class="button-minimized" on:click={()=>filtersProps?filterBarExpanded=!filterBarExpanded:null}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clip-rule="evenodd" />
                </svg>
            </div>
        </div>
    </div>
</div>