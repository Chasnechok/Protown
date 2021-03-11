<script>
    import Select from 'svelte-select';
    import RangeSlider from "svelte-range-slider-pips";
    import { countries, obce, kyivDistricts } from "../../helpers/locations";
    import Checkbox from "svelte-checkbox";
    import { slide } from 'svelte/transition';

    const groupBy = (item) => item.group;
    const getSelectionLabel = (option) => option.label.replace("ий", "ом");
    let districtSelector;
    let selectedDeal = "lease";
    let selectedType = "house";
    let selectedObec = "Киев";
    let selectedCountry = "UA";
    let currency = "UAH";
    let deals = [{value: "buy", label: "Купить"}, {value: "lease", label: "Арендовать"}, {value: "sell", label: "Продать"}];
    let types = [{value: "house", label: "Дом"}, {value: "flat", label: "Квартиру"}, {value: "commersion", label: "Коммерцию"}, {value: "land", label: "Участок"}];
    let selectedDistricts = [];
    let budgetRange = [0, 100];
    $: priceRangeMax = currency === "UAH" ? 30000 : 1000;
    $: priceRange = [0,priceRangeMax];
    let roomsRange = [1, 4];
    $: extrasAll = selectedType === ("house" || "flat" || "commersion") && selectedDeal === "buy" ? [{label: "Без комиссии", c: false}, {label: "С мебелью", c: false}] :
    selectedType === ("house" || "flat" || "commersion") && selectedDeal === "lease" ? [{label: "Без комиссии", c: false}, {label: "С мебелью", c: false}, {label: "Скоро освобождается", c: false}] : 
    [{label: "Без комиссии", c: false}];
    let filterBarExpanded;
    let innerWidth;
    $: if(innerWidth) {filterBarExpanded = innerWidth>=1024 ? true : false};
    
</script>

<style>
    .filter-bar-wrapper {
        flex: 1 1 30%;
    }
    .filter-bar-xl {
        /* position: fixed; */
        max-width: 495px;
        background-color: white;
        padding: 1em 2em;
        display: flex;
        flex-direction: column;
        border-radius: .3em;
        box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.15);
    }
    .deal-selector {
        display: flex;
        justify-content: space-between;
        font-size: 18px;
    }
    .deal:hover, .button-minimized:hover, .filter-bar-minimized:hover, .type:hover, .location-selector :global(.selectContainer:hover), .location-selector :global(input:hover), .range-selector span:not(:first-child):not(.active) {
        cursor: pointer;
    }
    .deal, .type  {
        color: #AAAAAA;
    }
    .deal.active, .type.active {
        color:#252525;
    }
    .type-selector {
        margin-top: 1em;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }
    .type {
        background-color: #E5E5E5;
        flex: 0 1 40%;
        margin: .3em;
        height: fit-content;
        border-radius: .3em;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px 0;
    }
    .type.active {
        background-color: white;
        box-shadow: inset 0px 0px 4px rgba(0, 0, 0, 0.25);
    }
    .type.active img {
        filter: none;
    }
    .type img {
        max-height: 50px;
        margin-right: 6px;
        filter: grayscale(80%);
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
    .extras-selector .checkbox-wrapper > span {
        transition: 400ms;
        margin-right: 8px;
    }
    .controls {
        display: flex;
        justify-content: space-around;
        margin-top: 1.5em;
        position: relative;
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
    .filter-bar-l {
        display: none;
        position: relative;
        margin-bottom: 1em;
    }
    .line1 {
        margin-top: 0 !important;
    }
    .filter-bar-l svg {
        height: 2em;
    }
    .filter-bar-minimized {
        text-align: center;
        width: 100%;
        font-size: 16px;
    }
    .button-minimized {
        position: absolute;
        left: 50%;
        bottom: 0;
        color: #2c3e50;
        transform: translate(-50%, 50%);
    }
    @media only screen and (min-width: 1401px) {
    .filter-bar-xl {
        --placeholderColor: rgb(98, 98, 219);
    }
    .location-selector :global(.multiSelect) {
        --indicatorRight: 60px;
    }
    }

    @media only screen and (max-width: 1400px) {
    .location-selector {
        justify-content: center;
    }
    .location-selector :global(.selection) {
        color: #2c3e50;
        font-weight: bold;
        font-size: 18px;
    }
    .filter-bar-wrapper {
        flex: unset;
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
    .filter-bar-xl{
        display: none;
    }
    .filter-bar-l {
        background-color: white;
        border-radius: .3em;
        box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.15);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 1em;
        --indicatorColor: rgb(98 98 219 / 90%);
        --placeholderColor: #2c3e50;
    }
    }
</style>
<svelte:window bind:innerWidth/>
<div class="filter-bar-wrapper">
    <div class="filter-bar-xl">
        <div class="deal-selector">
            <div class="deal" on:click={()=>selectedDeal="buy"} class:active={selectedDeal === "buy"}>Купить</div>
            <div class="deal" on:click={()=>selectedDeal="lease"} class:active={selectedDeal === "lease"}>Арендовать</div>
            <div class="deal" on:click={()=>selectedDeal="sell"} class:active={selectedDeal === "sell"}>Продать</div>
        </div>
        <div class="type-selector">
            <div class="type" class:active={selectedType==="house"} on:click={()=>selectedType="house"}><img alt="" src="data:image/png;base64,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"/>Дом</div>
            <div class="type" class:active={selectedType==="flat"} on:click={()=>selectedType="flat"}><img alt="" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QA/wD/AP+gvaeTAAADBklEQVR4nO2bz08TQRTHv1NtPZASUmoANeHgf0EiiYkXzxys0Sgc9CImaA9AxLqKF0ioJvRCSEQSE5seejKcSEyMP27ePGONEMUmFrY9qOB4gJV2uz+669vdrrzPpTDLvJ3OvP3s67AFGOZQI6gCKUoh1lmu3ZfAFQAnqOLq+AaBJ2p3aUpRlB2KgEcpggBAvFzNSIgJqngmHIfEeGe5XwKYpAhINgGAuAwAQykVfX27dGHr2Fg/gmIhDimRAtEERCiC7BMFAPmbMGITQnshu3QpM2AZkJPFQpwupAlSyGWqWGQZoCY/ZgA5SxXPgulq96dpqmBkqaQxN7okAaB/fNjw+NAp6/5TL8uG7YniCwBAOjdCOmZKB4QSQgc0Upp5atierfv55OkeXBg733D84dnkQYytX1h8v+XF8P7S1hkgpffnMM2AhesL0Woseg8QKQC9ADqcBKZ2gFeYTsD+m7/j52CCwHQCBCJXJaTjyi73qMuw/cuzFfxY30QWxtd+PruCjbVNJADsJBPYHhxo+Zz/gqkDJOQuQFjZCeu7l4gcHPfj2tewyAA8l8AEVWXXe2lvxc0coGWE3w4wzYDtZOkuBGb8HEwQ2FZVWmV3e97Y6nqyN/fu//q7gOYAwNoBgLEDtErQIbb7B54VQk0E4wDb/QPXE1C/YkYrqofKAaO3Ki2PsZX9A9eVYP2KtS/2+weuM8BuxfVQ1QFmdYYVVvsH/n0WCK4OsNw/CJ0DnN6N0rmRjNXf/ecOsCd0DqDmMDjAktA5wO35zQitA6jOH1oHuF1xPewAtx3ZAewAdoAz2AHsAFLYAewAGtgBrnqBHcAOcAw7gB1ACjuAHUADO8BVL7ADXM/42ofPWM2/g1qpNbTHuzpw7uIAgGOenl+P788JGr15AFArNazm3/o9HO8cYPakqMbYg8GG3x9nXkH9Xmv5SRB2QLs74FpPzLB98etPkn6hdUC7wRMQ9ACCpskkczeW3kDAn3/O+40Qr9Pzw2fqm5ozICI8/d5XoEg/P2UwTCj4A0HC19nO8uTbAAAAAElFTkSuQmCC">Квартиру</div>
            <div class="type" class:active={selectedType==="commersion"} on:click={()=>selectedType="commersion"}><img alt="" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QA/wD/AP+gvaeTAAAE80lEQVR4nO2bX2gcRRzHv7PZ22s1d5deoqGYP0VtPQUrVYsYMCjNQ5IHKQgiFdMWUR88H7RWsFKIiPiU+OC9iGIQQYIPlYpeKhUStClowIJSYv9JokEhTXLc7SXe7e3t+HDZu83lbv/vzon3eZub2Znf/PY3v99vZvYAnxmPf5Icj0987fe49eD9HpCCDPk9ph4cawFY01QAawFYw1wBrJ2i706wGtZOkbkFsKapANYCsIbYfXDs5YlZEPS5KYxlCLlw4oNjjznpwr4FcERxMrArUEqddmHbAlTG4hMUAKKvHttW99daXvfZDVG0PF70TClinkgcdyw70PQBTQU0FeBVx5nJJIRz39WtF5LnEf7+Yt368Mysbr1beJYKy38v62qXu7miW8+vpdwWqbYcvozSwDDbDCmdt6EoF1kNX4aZAqTBAVt5gNs0lwBrAeyiZqAqBGRJAXnx9cTRKSv9eKYA/o5OSLL97YLcEYWVTJ+CdhHQDwH0WBnHMwWEnx7S3QuMxAIoFiP46Od0zfpMv/5G84n4k1vK04mvAKDbqpzMlkBXK4dGcEG+KiAsEAx087gzXJn46f52/J4q4Nsb61jZcB4Wq31DTTTnCL69grBA8Px9AmK7OAgtld+DLQT3dgh46aE2RII+iaM5R/DNAga6eezkgetpBVOLMkSJYkMUEQ5yOHxPK/a1Cxi6+1ZMXjaXG2TXpS3lg8cHddvPTZwDsP0cwTcLUM1enfxILIAXHowgk1dw9koWALA3KvglThnfLEA1e1EqWZ/WCabzChbTBUthr5r5b35Edrm0gQp17kJs+BFTz/mmAKlYUkJIIGUlaKkXDs1CNIZtRY9lBYyOjvKhlZ53AXIUQKcjaWqwICrY18ZhuJdHclF2u3vTb7yasg8I3+x9GyBvwIPJA8D0koxcEbgrwuGV/ZW1frq/Hc/eH0bHLS06T3tHZQkQMgJQPPWMiN27zcfjxPttptqt5ig+vizh0GYeENycrxoG97QFkPgphXTeXvrsmg+gHp72ZySKL28UymUnYbAaxz6AQvkUIG+d+SJkSwCraPcCZ69kcbIv6igMOvYBYscfowB5z7YEBozEAnguFiiXu1o59EZKZdXsg7wrdx2W0EYBGcCpsfjEmwDw+MEdpjqYmcuZanf7Tq5uGFRT4Jzs+KbLMr5lggti6S0P9/IICZU3HQlyOBxrBQBcW5NqPuslphKhS/MS0tnSBCIhDgdi1tfq9JKMnpCwLQye7IsCADYKFFPX1y31qfX8djFnAS4sTTUMzqcU5DVRNi9T/LqcR2IuhYzFEEhckMuUBdh547XQhsFTDwcBAO/8sGq7PyueX90NVsPsROjPrPLfuRew4wMyk0kICoU0OFCz/rPfCrr3AuGZWYAjhmeDKt7uBm2sNaO7QSOs3g06zgT1cMsHeInjTPD/im95QDVC8jx4qphe40Y0nA8wwuj7AKs0fYBNH9Cwd4N+4ZkPMLobdBu7PsC3vYDXNJwPMMoE3abhfIDTTNAvDBWwmlZwdaGA/OYpzg6BYO+eANojjTU9z/KAa5rJA0BOori6UMCjDwT1OzaIAkZfiRl9ISL+s9XBKprGskK31deV06hBbnPy+187AgD4ZfzzLQqph1EUMPpKzGqG2HPogKX2Ko1lxwxoKoC1AKwhDfHfH1YQcoFriP/+sIJS+i89TOVW64RmwAAAAABJRU5ErkJggg==">Коммерцию</div>
            <div class="type" class:active={selectedType==="land"} on:click={()=>selectedType="land"}><img alt="" src="data:image/png;base64,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"/>Участок</div>
        </div>
        <div class="location-selector">
            <span>В <Select items={countries} isClearable={false} isSearchable={false} selectedValue={countries[0]} on:select={({detail})=>selectedCountry=detail.value} /></span>
            <span>городе <Select {groupBy} items={obce} isClearable={false} isSearchable={false} selectedValue={obce[0]} on:select={({detail})=>selectedObec=detail.value} /></span>
            {#if selectedObec.toLowerCase() === "киев"}<span>В
                <Select
                noOptionsMessage="Вы выбрали все возможные районы"
                isClearable={selectedDistricts[0] ? true : false} bind:this={districtSelector}
                showIndicator={!selectedDistricts[0] ? true : false} {getSelectionLabel}
                isMulti {groupBy} items={kyivDistricts} placeholder="любом районе"
                listPlacement="bottom" on:select={({detail})=> {
                    selectedDistricts = detail??[];
                }} />
            </span>
            {/if}
        </div>
        <div class="range-selector budget">
            <span>Бюджет</span>
            <RangeSlider step={10} formatter={ v => new Intl.NumberFormat("en-US").format(v * 1000) } float prefix={currency === "UAH" ? "₴" : currency === "EUR" ? "€" : "$"} max={priceRangeMax} range bind:values={priceRange}  />
            <span style="cursor: default;">{priceRange[0]*1000} - {priceRange[1]*1000}&nbsp</span>
            <span on:click={()=>currency="UAH"} class:active={currency==="UAH"}>гривен&nbsp</span>
            <span on:click={()=>currency="USD"} class:active={currency==="USD"}>долларов&nbsp</span>
            <span on:click={()=>currency="EUR"} class:active={currency==="EUR"}>евро</span>
        </div>
        <div class="range-selector area">
            <span>Площадь</span>
            <RangeSlider step={2} float suffix="м²" max={100} range bind:values={budgetRange}  />
            <span style="cursor: default;">{budgetRange[0]} - {budgetRange[1]}&nbspм<sup>2</sup></span>
        </div>
        <div class="range-selector rooms">
            <span>Количество комнат</span>
            <RangeSlider pips all='label' min={1} max={5} range bind:values={roomsRange}  />
        </div>
        <div class="extras-selector">
            <span>Дополнительно</span>
            <div class="checkboxes-group">
                {#each extrasAll as val}
                <div class="checkbox-wrapper">
                    <span style={`color: ${val.c ? "black" : "#AAAAAA"};`}>{val.label}</span>
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
        <div class="controls">
            <button>Сбросить</button>
            <button>Искать</button>
        </div>
    </div>

    <div class="filter-bar-l">
        {#if filterBarExpanded}
        <div transition:slide={{delay: 100}} class="line1 location-selector">
            <Select on:select={({detail})=>selectedDeal=detail.value} items={deals} isClearable={false} isSearchable={false} selectedValue={deals[1]} />
            <Select on:select={({detail})=>selectedType=detail.value} items={types} isClearable={false} isSearchable={false} selectedValue={types[1]} />
            <span>в <Select items={countries} isClearable={false} isSearchable={false} selectedValue={countries[0]} on:select={({detail})=>selectedCountry=detail.value} /></span>
            <span>городе <Select {groupBy} items={obce} isClearable={false} isSearchable={false} selectedValue={obce[0]} on:select={({detail})=>selectedObec=detail.value} /></span>
        </div>
        {#if selectedObec.toLowerCase() === "киев"}
            <div transition:slide={{delay: 200}} class="line2 location-selector">
                <div>
                    <span style="font-size: 18px; font-weight: bold;">В</span>
                    <Select
                    noOptionsMessage="Вы выбрали все возможные районы"
                    isClearable={selectedDistricts[0] ? true : false} bind:this={districtSelector}
                    showIndicator={!selectedDistricts[0] ? true : false} {getSelectionLabel}
                    isMulti {groupBy} items={kyivDistricts} placeholder="любом районе"
                    listPlacement="bottom" on:select={({detail})=> {
                        selectedDistricts = detail??[];
                    }} />
                </div>
            </div>
        {/if}
        <div transition:slide={{delay: 300}} class="range-selectors line3">
            <div class="range-selector budget">
                <span>Бюджет</span>
                <RangeSlider step={10} formatter={ v => new Intl.NumberFormat("en-US").format(v * 1000) } float prefix={currency === "UAH" ? "₴" : currency === "EUR" ? "€" : "$"} max={priceRangeMax} range bind:values={priceRange}  />
                <span style="cursor: default;">{priceRange[0]*1000} - {priceRange[1]*1000}&nbsp</span>
                <span on:click={()=>currency="UAH"} class:active={currency==="UAH"}>гривен&nbsp</span>
                <span on:click={()=>currency="USD"} class:active={currency==="USD"}>долларов&nbsp</span>
                <span on:click={()=>currency="EUR"} class:active={currency==="EUR"}>евро</span>
            </div>
            <div class="range-selector area">
                <span>Площадь</span>
                <RangeSlider step={2} float suffix="м²" max={100} range bind:values={budgetRange}  />
                <span style="cursor: default;">{budgetRange[0]} - {budgetRange[1]}&nbspм<sup>2</sup></span>
            </div>
            <div class="range-selector rooms">
                <span>Количество комнат</span>
                <RangeSlider pips all='label' min={1} max={5} range bind:values={roomsRange}  />
            </div>
        </div>
        <div transition:slide={{delay: 400}} class="extras-selector">
            <span>Дополнительно</span>
            <div class="checkboxes-group">
                {#each extrasAll as val}
                <div class="checkbox-wrapper">
                    <span style={`color: ${val.c ? "black" : "#AAAAAA"};`}>{val.label}</span>
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
        <div transition:slide={{delay: 450}} class="controls">
            <button>Сбросить</button>
            <button>Искать</button>
        </div>
        <div transition:slide class="button-minimized" on:click={()=>filterBarExpanded=!filterBarExpanded}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clip-rule="evenodd" />
            </svg>
        </div>
        {:else}
        <div  class="filter-bar-minimized" on:click={()=>filterBarExpanded=!filterBarExpanded}>
            <span transition:slide={{delay: 100}}> Показать фильтры</span>
            <div transition:slide={{delay: 200}} class="button-minimized">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clip-rule="evenodd" />
                </svg>
            </div>
        </div>
        {/if}
    </div>
</div>