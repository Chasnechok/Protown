
<script>
    import Select from 'svelte-select';
    import ImagePlaceholder from '../../helpers/ImagePlaceholder.svelte';
    import { onMount } from 'svelte';
    import { kFormatter } from "../../helpers/converter";
    import Checkbox from "svelte-checkbox";
    import { countries, obce, kyivDistricts } from "../../helpers/locations"

    let priceRangeSlider, sizeRangeSlider;
    export let deal = "buy", type = "house", selectedObec = "Киев", selectedCountry = "UA", currency = "UA", selectedDistricts, roomCount, flipper;
    $: priceRange = currency === "UAH" ? 1000 : 5000;
    $: maxPrice = priceRange;
    let minPrice = 0, minSq = 0;
    let maxSq = 100;
    let PriceRange, SizeRange;
    $: extrasAll = type !== "land" ? [{label: "Без комиссии", c: false}, {label: "Новострой", c: false}, {label: "С мебелью", c: false}] : [{label: "Без комиссии", c: false}];
    const groupBy = (item) => item.group;
    onMount(() => {
        const selects = document.getElementsByClassName("selectContainer");
        const indicators = document.getElementsByClassName("indicator");
        for (let i = 0; i < selects.length; i++) {
            selects[i].style.padding = "0 0 0 4px";
            indicators[i].style.position = "initial";
        }
        
        PriceRange = new DoubleSlider(priceRangeSlider);
        PriceRange.addEventListener('slider:input', () => {
            const {min, max} = PriceRange.value;
            minPrice = min; maxPrice = max;
        });
        SizeRange = new DoubleSlider(sizeRangeSlider);
        SizeRange.addEventListener('slider:input', () => {
            const {min, max} = SizeRange.value;
            minSq = min; maxSq = max;
        });

	});

   
</script>

<style>

    .room-count, .price-range-input, .location-select-wrapper, .estate-type, .extras, .controls{
        display: grid;
        grid-template-columns: 2em 1fr 1fr 2em;
    }
    .location-select-wrapper, .deal, .estate-type, .location-select-wrapper, .price-range-input, .room-count, .extras{
        margin-top: var(--marginTopFilterBar);
    }
    .deal{
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        justify-items: center;
        list-style: none;
    }

    .deal .active{
        color: #AAAAAA;
    }
    .estate-type{
        gap: 6px;
    }
    .estate-type div{
        width: 170px;
        height: 50px;
    }

    .estate-type .item{
        display: grid;
        grid-template-columns: 0.7fr 1fr;
        align-items: center;
        justify-items: center;
        background-color: #E5E5E5;
        border-radius: 10px;
        color: rgba(85, 85, 85, 0.6);
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 21px;
    }
    .estate-type .item:not(.active):hover{
        box-shadow: inset 0px 0px 6px rgb(0 0 0 / 30%);
    }
    .estate-type .item.active{
        box-shadow: inset 0px 0px 4px rgba(0, 0, 0, 0.5);
        background-color: white;
        color: black;
        border-radius: 10px;
    }
    .location-select-wrapper{
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
    }
    .location-select{
        display: flex;
        align-items: center;
        grid-column: 2/4;
        --border: none;
    }
    .location-select, .indicator {
        --padding: 0 0 0 5px;
        --selectedItemPadding: 0 0 0 5px;
        --inputPadding: 0;
        --indicatorPosition: static;
        --indicatorColor: rgb(98, 98, 219, 0.7);
        --itemIsActiveBG: rgb(98, 98, 219, 0.9);
        --multiItemActiveBG: rgb(98, 98, 219, 0.9);
        --multiClearHoverFill: rgb(98, 98, 219, 0.7); 
        --multiClearBG: #53537db3;
        --itemHoverBG: rgb(98, 98, 219, 0.1);
        --multiItemBG: rgb(98, 98, 219, 0.2);
        --borderFocusColor: rgb(98, 98, 219, 0.7);
        --borderHoverColor: rgb(98, 98, 219, 0.5);
        --multiSelectItemTextColor: #000000ab;
        --indicatorRight: -0.2em;
    }
    .disctrict-select{
        grid-row: 2;
        grid-column: 2/4;
    }

    .price-range-input .price-range-display span{
        font-style: normal;
        font-weight: 300;
        font-size: 12px;
        font-size: 12px;
        color: #A4A4A4;
    }
    .price-range-input span:not(.active):not(:first-child):hover, .estate-type .item:not(.active):hover,
    .deal span:not(.active):hover,
    .room-count-button:hover, .controls > div, .disctrict-select{
        cursor: pointer;
    }
    .price-range-input span.active{
        font-size: 14px;
        color: black;
    }
    .price-range-slider{
        color: #6262db;
    }
    .room-count-button, .deal span{
        cursor:default;
    }
    .room-count-button{
        width: 60px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 10px;
        background-color: #E5E5E5;
        color: rgba(85, 85, 85, 0.6);
    }
    .room-count-button.active{
        background-color: rgba(98, 98, 219, 0.8);
        color: white;
    }
    .checkbox-wrapper{
        display: grid;
        grid-template-columns: 1fr 0.5fr;
        align-items: center;
    }

    .controls > div{
        width: 130px;
        height: 40px;
        border-radius: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .controls > div:first-child:hover, .room-count-button:not(.active):hover{
        transform: translateY(-4px);
        box-shadow: 0px 4px 2px rgba(0, 0, 0, 0.45);
    }
    .controls > div:last-child:hover, .room-count-button:hover{
        transform: translateY(-4px);
        box-shadow: 0px 4px 2px rgba(0, 0, 0, 0.65);
    }
    .controls > div:last-child:active, .room-count-button:active{
        transform: translateY(-2px);
        box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.65);
    }
    .controls > div:first-child:active, .room-count-button:not(.active):active{
        transform: translateY(-2px);
        box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.45);
    }
    .controls > div:first-child{
        grid-column: 2/3;
        background-color: #E5E5E5;
        color: rgba(85, 85, 85, 0.6);
    }
    .controls > div:last-child{
        grid-column: 3/4;
        justify-self: end;
        color: white;
        background-color: rgba(98, 98, 219, 0.8);
    }
    .indicator{
        display: inline-block;
        transform: translateY(20%);
        position: var(--indicatorPosition, absolute);
        right: var(--indicatorRight, 10px);
        top: var(--indicatorTop, 11px);
        width: var(--indicatorWidth, 20px);
        height: var(--indicatorHeight, 20px);
        color: var(--indicatorColor, #c5cacf);
    }
    .indicator svg{
        display: inline-block;
        fill: var(--indicatorFill, currentcolor);
        line-height: 1;
        stroke: var(--indicatorStroke, currentcolor);
        stroke-width: 0;
    }

  
 

</style>



    <div class="deal">
		<span class={deal === "buy" ? "active" : ''} on:click={() => deal = "buy"}>Купить</span>
        <span class={deal === "lease" ? "active" : ''} on:click={() => deal = "lease"}>Арендовать</span>
        <span class={deal === "sell" ? "active" : ''} on:click={() => deal = "sell"}> Продать</span>
    </div>
    <div class="estate-type">
        {#each ["house","flat","comerse","land"] as t, i}
        <div on:click={()=>type = t} class={t === type ? "item active" : 'item'} style={`grid-column: ${i === 0 || i === 2 ? "2/3" : "3/4"}; justify-self: ${i === 0 || i === 2 ? "start" : "end"};`}>
            <ImagePlaceholder
                url={i !== 0 ? 'https://www.dropbox.com/s/0647rxpdehax0h4/flat-small.webp?raw=1' : 'https://www.dropbox.com/s/gmz4vzodd40f1ov/house-small.webp?raw=1'} 
                alt="estate-type"
                imageWidth="30px"
                imageHeight="30px"
                placeholderWidth="30px"
                placeholderHeight="30px"
            />
           
            <span>{i === 0 ? "Дом" : i === 1 ? "Квартиру" : i === 2 ? "Коммерцию" : "Участок"} </span>
        </div>
        {/each}
    </div>
    <div class="location-select-wrapper">
        <div class="location-select">
         В<Select on:select={({detail})=>console.log(detail)} containerClasses="filter-bar-select" items={countries} isClearable={false} isSearchable={false} selectedValue={countries[0]} on:select={({detail})=>selectedCountry=detail.value} />
        {#if selectedCountry === "UA"}
         <span>{selectedObec !== "Киев" && selectedCountry === "UA" ? ", посёлке" : ", городе"}</span><Select {groupBy} containerClasses="filter-bar-select" items={obce} isClearable={false} isSearchable={false} selectedValue={selectedObec ? selectedObec : obce[0]} on:select={({detail})=>selectedObec=detail.value} />
        {/if}
        </div>
        {#if selectedObec === "Киев" && selectedCountry === "UA"}
        <div class="disctrict-select" on:click={()=>flipper.flip()}>
            В&nbsp
            {#if !selectedDistricts || selectedDistricts.length == kyivDistricts.length }
            <span>любом районе</span>
            {:else if kyivDistricts.length - selectedDistricts.length <= 4}
            <span>любом районе, кроме</span>
                {#each kyivDistricts.filter(el=>!selectedDistricts.some(sd => sd.value == el.value)) as {label, value}, i}
                   <span style={`font-size: ${value === "SHV" ||value === "SV" ? "14px" : "16px"}`}>{i == kyivDistricts.filter(el=>!selectedDistricts.some(sd => sd.value == el.value)).length -1 ? label.replace("ий", "ого") :
                    i == kyivDistricts.filter(el=>!selectedDistricts.some(sd => sd.value == el.value)).length - 2 ? label.replace("ий", "ого и ") :
                    label.replace("ий", "ого, ")}</span>
                {/each}
            {:else}
                {#each selectedDistricts as {label}, i}
                    <span>{i == selectedDistricts.length -1 ? label.replace("ий", "ом") :
                    i == selectedDistricts.length - 2 ? label.replace("ий", "ом и ") :
                    label.replace("ий", "ом, ")}</span>
                {/each}
                <span>районе</span>
            {/if}
            <div class="indicator">
                <svg width="100%" height="100%" viewBox="0 0 20 20" focusable="false">
                    <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747
                3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0
                1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502
                0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0
                0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z">
                    </path>
                </svg>
            </div>
        </div>
        {/if}
    </div>
    <div class="price-range-input">
        <span style="font-weight: 500; font-size: 18px; grid-column: 2/4;">Бюджет</span>
        <div class="price-range-slider" style="grid-column: 2/4;"
        bind:this={priceRangeSlider}
        data-min={minPrice}
        data-max={maxPrice}
        data-range={priceRange}
      ></div>
        <div class="price-range-display" style="grid-column: 2/4;">
            <span>{kFormatter(minPrice)}{minPrice < 1000 ? " тысяч" : "" } - {kFormatter(maxPrice)} {maxPrice >= 1000 ? maxPrice === 1000 ? "миллиона":
                "миллионов"
              :"тысяч"}</span>
            <span class:active = {currency === "UAH" ? true : false} on:click={() => currency = "UAH"}>&nbspгривен</span>
            <span class:active = {currency === "USD" ? true : false} on:click={() => currency = "USD"}>&nbspдолларов</span>
            <span class:active = {currency === "EUR" ? true : false} on:click={() => currency = "EUR"}>&nbspевро</span>
        </div>
    </div>

    <div class="price-range-input">
        <span style="font-weight: 500; font-size: 18px; grid-column: 2/4;">Площадь</span>
        <div class="price-range-slider" style="grid-column: 2/4;"
        bind:this={sizeRangeSlider}
        data-min={minSq}
        data-max={maxSq}
        data-range="100"
      ></div>
        <div class="price-range-display" style="grid-column: 2/4;">
            <span>{minSq} - {maxSq} м<sup><small>2</small></sup></span>
        </div>
    </div>
    <div class="room-count">
        <span style="font-weight: 500; font-size: 18px; grid-column: 2/4; margin-bottom: 1em;">Количество комнат</span>
        <div class="button-group" style="grid-column: 2/4;display: flex;justify-content: space-between;">
            {#each roomCount as val}
                <div on:click={()=>val.a=!val.a} class:active={val.a} class="room-count-button">{val.l>4 ? val.l+"+" : val.l}</div>
            {/each}
        </div>
    </div>
    <div class="extras">
        <span style="font-weight: 500; font-size: 18px; grid-column: 2/4; margin-bottom: 0.5em;">Дополнительно</span>
        <div class="checkboxes-group" style="grid-column: 2/4; display: grid; grid-template-columns: 1fr 1fr;">
            {#each extrasAll as val, i}
            <div class="checkbox-wrapper">
                <span style={`color: ${val.c ? "black" : "#AAAAAA"}; transition: 400ms`}>{val.label}</span>
                <Checkbox
                size="1em"
                duration=500
                primaryColor="rgba(98, 98, 219, 0.8)"
                bind:checked = {val.c}>
                </Checkbox>
            </div>
            {/each}
        </div>
    </div>
    <div class="controls" style="margin-bottom: 1em; margin-top: 2em;">
        <div><span>Сбросить</span></div>
        <div><span>Искать</span></div>
    </div>

