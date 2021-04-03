<script>
    import { createBlankEstate, daysOfWeek, monthsOfYear } from "../../helpers/converter";
    import axios from "axios";
    import DragDropList from '../../helpers/DragDropList.svelte';
    import { BarLoader } from 'svelte-loading-spinners';
    import Compressor from 'compressorjs';
    import Dropzone from "svelte-file-dropzone";
    import { countries1, kyivDistricts, flatPlanning, communicationsList, landTypes, flatExtras, houseExtras  } from "../../helpers/locations";
    import { slide } from 'svelte/transition';
    import Datepicker from 'svelte-calendar';
    import { onMount } from "svelte";
    import Select from 'svelte-select';
    import { tooltip } from '../../helpers/tooltip';
    import { scrollToTop } from "svelte-scrollto";
    import dayjs from "dayjs";
    export let visikom;
    export let agentIdentifier;
    export let addNotification;
    export let estateToEdit;
    export let mode;
    let mounted = false;
    onMount(()=>{
        mounted=true;
        if(estateToEdit&&estateToEdit.images&&estateToEdit.images[0]){
                    estateToEdit.images = estateToEdit.images.map(el=>{
                    let url = new URL(`https://assets.rich-house.online/estates/${estateToEdit.type}/${estateToEdit._id}/${el}`);
                    return {id: el, html: `<img style="display: block;padding: 0 1.6em;max-width:100%;" src="${url}" alt="${el}" />`}
                    })
                }
    })
    // page and bufferedEstates is needed to update the list after creation of an estate if page == 1;
    let isLoading = false;
    let deleteMode = false;
    let estateTemplate = estateToEdit??createBlankEstate();
    // restore null to objects if needed
    ["city", "street", "metro", "zk"].forEach(key => {if(!estateTemplate.adress[key])estateTemplate.adress[key]={}});
    ["comment", "included"].forEach((key,i) => {if(!estateTemplate.extras[key])estateTemplate.extras[key]=i==0?{}:[]});
    if(!estateTemplate.details.area)estateTemplate.details.area={};
    // selectors to clear bindings
    let districtSelector, streetSelector, metroSelector, citySelector, purposeSelector, extrasSelector, planningSelector, communicationsSelector;
    $: selectorsToClear = [districtSelector, streetSelector, metroSelector, citySelector, purposeSelector, extrasSelector, planningSelector, communicationsSelector];
    let selectedDate, cityLabel, expanded = false; 
    let userHasChosenDate = false;
    if(!isNaN(Date.parse(estateTemplate.realised))&&dayjs(estateTemplate.realised).isAfter(dayjs())) {userHasChosenDate = true; selectedDate = new Date(estateTemplate.realised);};
    if(!isNaN(Date.parse(estateTemplate.realised))&&dayjs(estateTemplate.realised).isBefore(dayjs())) estateTemplate.realised = false;
    $: if(!estateTemplate.realised) userHasChosenDate = false;
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
        if(!detail||!detail.properties) return;
        cityLabel = detail.properties.type.charAt(0).toUpperCase()+detail.properties.type.slice(1);
        estateTemplate.adress.city.ru = detail.properties.name;
        handleClear("city");
    }
    const handleStreetSelect = (detail) =>{
        if(!detail||!detail.properties) return;
        estateTemplate.adress.street.ru = detail.properties.name;
        if(detail.properties.name_en){
            estateTemplate.adress.street.en = detail.properties.name_en;
        }
        if(detail.properties.zone){
            estateTemplate.adress.district = kyivDistricts.find(el=> el.label.toLowerCase() === detail.properties.zone.toLowerCase());
        }
        else{
            estateTemplate.adress.district = null;
        }
    }
    const handleDistrictSelect = (detail) =>{
        if(!detail||!detail.value) return;
        estateTemplate.adress.district = detail.value;
    }
    const handleMetroSelect = (option) => {
        if(!option||!option.properties) return;
        estateTemplate.adress.metro.ru = option.properties.name;
        estateTemplate.adress.metro.ua = option.properties.vitrine.match(/"(.*)"/)[1];
        estateTemplate.adress.metro.distance = undefined;
    }
    const handleTypeSelect = (option) => {
        estateTemplate.type=option;
        estateTemplate.details.planning=undefined;
        estateTemplate.extras.included=undefined;
    }
    const handleClear = (from) => {
        estateTemplate.adress.street.ru = undefined;
        estateTemplate.adress.estateNumber = undefined;
        if(metroSelector)metroSelector.handleClear();
        if(districtSelector)districtSelector.handleClear();
        if(from === "city"){
            if(streetSelector)streetSelector.handleClear();
            estateTemplate.adress.district = undefined;
        }
        if(from==="country") {
            estateTemplate.adress.city.ru = undefined;
            if(streetSelector)streetSelector.handleClear();
        }
        if(from === "street"){
            estateTemplate.adress.district = undefined;
        }
        if(from==="created"){
            selectorsToClear.forEach(selector=>selector&&selector.handleClear());
        }
    }
    const loadCitiesAsync = (filterText) => {
    return new Promise((resolve, reject) => {
      axios.get(`https://api.visicom.ua/data-api/4.0/ru/search/adm_settlement.json?text=Украина,%20${filterText}&key=${visikom}`)
      .then(response => resolve(response.data.type === "Feature" ? [response.data] : response.data.features))
      .catch(err => reject(err.response))
    });
    }
    const loadUndergroundsAsync = (filterText) => {
    return new Promise((resolve, reject) => {
      axios.get(`https://api.visicom.ua/data-api/4.0/ru/search/poi_underground_railway_station.json?intersect=STL1NQ7EP&text=${filterText}&key=${visikom}`)
      .then(response => resolve(response.data.type === "Feature" ? [response.data] : response.data.features))
      .catch(err => reject(err.response))
    });
    }
    const loadStreetsAsync = (filterText) => {
    return new Promise((resolve, reject) => {
      axios.get(`https://api.visicom.ua/data-api/4.0/ru/search/adr_street.json?text=Украина,%20${estateTemplate.adress.city.ru},%20${filterText}&key=${visikom}`)
      .then(response => resolve(response.data.type === "Feature" ? [response.data] : response.data.features))
      .catch(err => reject(err.response))
    });
    }
    const handleCompressImages = (imgs) => {
        Object.keys(imgs).map((img, i, arr) => {
        new Compressor(imgs[img], {
					quality: 0.7,
					convertSize: 1,
					mimeType: "image/jpeg",
					maxWidth: 1920,
					maxHeight: 1080,
					drew(context, canvas) {
                        let centerX = canvas.width / 2;
                        let centerY = canvas.height / 2;
                        let radius = 100;
                        context.beginPath();
                        context.fillStyle = 'rgb(255, 255, 255, 0.5)';
						context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
                        context.fill();
                        context.strokeStyle = 'white';
                        context.stroke();
                        context.font = 'bold 1.5rem Poppins';
						context.textAlign = 'center';
                        context.textBaseline = 'middle';
                        context.fillStyle = 'white';
                        context.strokeStyle = 'black';
                        context.lineWidth = 2;
                        context.strokeText('rich-house.net', centerX, centerY);
                        context.fillText('rich-house.net', centerX, centerY);
                        
					}, 
					success(result) {
                        estateTemplate.images = [{id: result.lastModified, image: result, html: `<img style="display: block;padding: 0 1.6em;max-width:100%;" src=${URL.createObjectURL(result)} alt="${result.lastModified}" />` }, ...estateTemplate.images]
					},
					error(err) {
					console.log(err.message);
					}
				});
      })
    }
    const createEstate = () => {
        isLoading = true;
        if(deleteMode) {
            return axios.delete("/estates/manage", {
                headers: {
				'content-type': 'application/json'
			    },
                data: {
                    _id: estateTemplate._id
                }
            }).then(res=>{
                isLoading = false;
                history.replaceState({mode: "list"}, "", "adminka")
                mode="list";
                scrollToTop();
                addNotification(res.data, 8000);
                
            }).catch(err => {
                isLoading = false;
                console.log(err.response);
                addNotification(err.response?.data);
                if(err.response?.data.code==="NO_ACCESS_E") {
                    setTimeout(()=>location.reload(), 3000)
                }
            })
        }
        
        const estate = new FormData();
        !estateTemplate.agent&&estate.append("agent", agentIdentifier);
        if(estateTemplate.images[0]){
            estateTemplate.images.filter(el=>el.image).forEach(img => {
                estate.append(img.id, img.image, img.image.name);
            });
            estateTemplate.images = estateTemplate.images.map(el=>el.image ? el.image.name : el.id);
        }
        for(let key in estateTemplate){
            if(estateTemplate[key] instanceof Object){
                estate.append(key, JSON.stringify(estateTemplate[key]));
            } else {
                if(key==="realised"&&userHasChosenDate){estate.append(key, selectedDate)}
                else estate.append(key, estateTemplate[key]);
            }
        }
        axios({
            method: !estateToEdit?"post":"put",
            url: "/estates/manage",
            data: estate,
            headers: {
				'content-type': 'multipart/form-data'
			}
        })
        .then(res => {
            isLoading = false;
            if(estateToEdit) {mode="list"; history.replaceState({mode: "list"}, "", "adminka")};
            estateTemplate = createBlankEstate();
            scrollToTop();
            handleClear("created");
            addNotification(res.data, 8000);
        })
        .catch(err => {
            isLoading = false;
            console.log(err.response);
            addNotification(err.response?.data);
            if(err.response?.data.code==="NO_ACCESS_E") setTimeout(()=>location.reload(), 3000);
        })
    }
</script>

<style>
    .gray-screen {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        backdrop-filter: blur(2px);
        z-index: 998;
    }
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
        position: relative;
    }
    .create-form >*:not(:first-child) {
        margin-top: 1em;
    }
    .prop-vertical {
        display: flex;
        flex-direction: column;
    }
    input, textarea {
        border: 1px solid #c0c1c1;
        outline: none;
        padding: 5px 12px;
        color: inherit;
        font-size: 16px;
        border-radius: 6px;
        background-color: #eaeaea;
        box-shadow: inset 0 1px 0 rgb(255 228 232 / 20%);
        letter-spacing: 1px;
        padding: 5px 12px;
        max-width: 100%;
    }
    label, h3 {
        margin: 0;
        padding: 0;
        margin-bottom: .25em;
        font-size: 18px;
        letter-spacing: .5px;
    }
    input:focus, textarea:focus {
        border-color: #6262db;
        box-shadow: 0 0 0 3px rgb(98 98 219 / 90%);
        background-color: #fff;
    }
    .options-horizontal {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
    }
    .options-horizontal > *:not(.street-slector-wrapper) {
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
    button:hover:enabled:not(.active), button:focus:enabled:not(.active) {
        cursor: pointer;
        letter-spacing: 1px;
        border-color: #6262db;
        color: #6262db;
    }
    button.active {
        border-color: #6262db;
        color: #6262db;
    }

    .option-horizontal {
        margin-top: .5em;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
    }
    .option-horizontal input[type='checkbox'] {
        margin-right: 1em;
        margin-left: .5em;
        height: 1em;
        width: 1em;
        cursor: pointer;
    }
    .option-horizontal input.left {
        margin: 0 0.5em;
    }
    .option-horizontal label, .option-horizontal span {
        color: #a9a9a9;
        transition: .3s;
        margin-bottom: 0;
    }
    .option-horizontal label.active, .option-horizontal span.active {
        color: #333;
    }
    .postfix-month::after{
        content: " / месяц";
        font-size: 12px;
        position: absolute;
        right: .5em;
        top: 50%;
        transform: translateY(-50%);
    }
    .postfix-m2::after {
        content: "м²";
        font-size: 12px;
        position: absolute;
        right: .5em;
        top: 50%;
        transform: translateY(-50%);
    }
    .postfix-sotki::after {
        content: "сотки";
        font-size: 12px;
        position: absolute;
        right: .5em;
        top: 50%;
        transform: translateY(-50%);
    }
    .postfix-m::after {
        content: "м";
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
    .street-slector-wrapper {
        min-width: 300px;
    }
    .area-prop label {
        font-size: 14px;
    }
    .area-prop input{
        max-width: 100px;
    }
    :global(.dropzone > p){
        display: none;
    }
    :global(.dropzone.nocontent::after){
        content: "Перетащите сюда изображения объекта или кликнете что бы выбрать"
    }
    :global(.dropzone.hascontent::after){
        content: "Можете добавить еще изображений"
    }
    :global(.dropzone:focus){
        border-color: rgb(98, 98, 219, 0.7) !important;
    }
    .images-wrapper{
        display: none;
        opacity: 0;
        visibility: hidden;
    }
    .images-wrapper :global(.item){
        border-radius: .5em;
    }
    .images-wrapper :global(.item .buttons){
        z-index: 10;
    }
    .reorganize {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 10px;
        color: white !important;
        padding: 0.2em .3em;
        background-color: rgb(127, 127, 226);
        margin-top: 1em;
    }
    .reorganize:hover{
        cursor: pointer;
    }
    .reorganize.expanded{
     border-radius: 10px 10px 0 0;
    }
    .images-wrapper.expanded{
        display: flex;
        justify-content: center;
        padding: 2em 0;
        border-radius: 0 0 1em 1em;
        background-color: #e5e5e5;
        visibility: visible;
        opacity: 1;
    }
    .controls-wrapper {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
    }
    button[type='submit'] {
        min-height: 2.5em;
    }
    button.delete {
        margin-right: 0.5em;
    }
    button.delete:enabled:hover, button.delete:focus {
        border-color: #f16767;
        color: #f16767;
    }

    @media only screen and (max-width: 940px) {
        button[type='submit'] {
        margin-right: auto;
        }
        label, h3 {
            text-align: center;
        }
        .options-horizontal, .option-horizontal {
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
    <form class="create-form" on:submit|preventDefault={createEstate}>
        {#if isLoading}
        <div class="gray-screen" />
        {/if}
        <div class="prop prop-vertical">
            <label for="estate-label">Название</label>
            <input bind:value={estateTemplate.label} id="estate-label" type="text" required>
        </div>
        <div class="prop prop-vertical">
            <h3>Тип недвижимости</h3>
            <div class="options-horizontal">
                <button type="button" class:active={estateTemplate.type==="flat"} on:click={()=>handleTypeSelect("flat")}>Квартира</button><button type="button" class:active={estateTemplate.type==="house"} on:click={()=>handleTypeSelect("house")}>Дом</button>
                <button type="button" class:active={estateTemplate.type==="land"} on:click={()=>handleTypeSelect("land")}>Участок</button><button type="button" class:active={estateTemplate.type==="commersion"} on:click={()=>handleTypeSelect("commersion")}>Коммерция</button>
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
                <span class:active={estateTemplate.realised&&userHasChosenDate}>&nbsp;и освобождается&nbsp;</span>
                <div class="date-picker-wrapper" style="{!estateTemplate.realised&&"pointer-events: none;"}">
                    <Datepicker buttonTextColor={estateTemplate.realised&&userHasChosenDate?"#333":"#a9a9a9"} highlightColor='#6262db' start={new Date()} {daysOfWeek} {monthsOfYear} bind:selected={selectedDate} bind:dateChosen={userHasChosenDate}/>
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
            {#if estateTemplate.type==="land"}
            <div  class="options-horizontal">
                <input type="checkbox" bind:checked={estateTemplate.details.partly} id="partly">
                <div class="option-horizontal">
                    <label class:active={estateTemplate.details.partly} for="partly">Покупка по частям</label>
                </div>
            </div>
            {/if}
        </div>
        <!-- 
            ADDRES
         -->
        <div class="prop prop-vertical">
            <h3 style="border-top: 1px dashed #333;padding-top: 1.5em;">Страна</h3>
            <Select selectedValue={countries1.find(el=>el.value===estateTemplate.adress.country)} containerClasses="country-select" items={countries1} isClearable={false} isSearchable={false} on:select={({detail})=>handleCountrySelect(detail)} />
        </div>
        <div class="prop prop-vertical">
            <h3>{cityLabel && estateTemplate.adress.country === "UA" ? cityLabel : "Город"}</h3>
            {#if estateTemplate.adress.country === "UA"}
                <Select selectedValue={estateTemplate.adress.city.ru&&estateTemplate.adress.city.ru} bind:this={citySelector} hideEmptyState placeholder="Введите название населенного пункта..." loadOptions={loadCitiesAsync} {optionIdentifier} {getSelectionLabel} {getOptionLabel}  on:select={({detail}) => handleCitySelect(detail)} on:clear={()=> handleClear("country")}></Select>
            {:else}
            <input bind:value={estateTemplate.adress.city.ru} placeholder="Введите название населенного пункта..." type="text">
            {/if}    
        </div>
        <div class="prop prop-vertical">
            <h3>Улица</h3>
            <div class="options-horizontal">
                {#if estateTemplate.adress.country === "UA"}
                <div class="street-slector-wrapper">
                    <Select selectedValue={estateTemplate.adress.street&&estateTemplate.adress.street.ru&&estateTemplate.adress.street.ru} on:clear={()=>handleClear("street")} bind:this={streetSelector} isDisabled={estateTemplate.adress.city.ru == undefined} hideEmptyState placeholder="Введите название улицы..." loadOptions={loadStreetsAsync} {optionIdentifier} {getSelectionLabel} {getOptionLabel}  on:select={({detail}) => handleStreetSelect(detail)} ></Select>
                </div>
                {:else}
                <input disabled={estateTemplate.adress.city.ru == undefined} bind:value={estateTemplate.adress.street.ru} placeholder="Введите улицу..." type="text">
                {/if}
                <div class="option-horizontal">
                    <label for="estateNumber" class:active={estateTemplate.adress.estateNumber}>&nbsp;номер дома&nbsp;</label>
                    <input class="left" bind:value={estateTemplate.adress.estateNumber} disabled={!estateTemplate.adress.street.ru} id="estateNumber" type="text">
                </div>
            </div>
        </div>
        {#if estateTemplate.adress.city.ru === "Киев" && estateTemplate.adress.country === "UA"}
        <div  class="prop prop-vertical">
            <h3>Район</h3>
            <Select placeholder="Введите название района..." selectedValue={estateTemplate.adress.district?kyivDistricts.find(el=>el.value===estateTemplate.adress.district):null} isDisabled={!estateTemplate.adress.street.ru} containerClasses="district-select" bind:this={districtSelector} items={kyivDistricts}  on:select={({detail}) => handleDistrictSelect(detail)} />   
        </div>
        {/if}
        {#if estateTemplate.adress.city.ru === "Киев" && estateTemplate.adress.country === "UA"}
        <div  class="prop prop-vertical">
            <h3>Станция метро</h3>
            <div class="options-horizontal">
                <div class="street-slector-wrapper">
                <Select selectedValue={estateTemplate.adress.metro&&estateTemplate.adress.metro.ru&&estateTemplate.adress.metro.ru} bind:this={metroSelector} isDisabled={!estateTemplate.adress.street.ru} hideEmptyState placeholder="Введите станцию метро..." loadOptions={loadUndergroundsAsync} {optionIdentifier} {getSelectionLabel} {getOptionLabel}  on:select={({detail}) => handleMetroSelect(detail)}
                    on:clear={()=> Object.keys(estateTemplate.adress.metro).forEach(key => estateTemplate.adress.metro[key] = undefined)} />
                </div>
                <div class="option-horizontal">
                    <label for="metroDistance" class:active={estateTemplate.adress.metro.distance}>&nbsp;на расстоянии&nbsp;</label>
                    <input class="left" bind:value={estateTemplate.adress.metro.distance} disabled={!estateTemplate.adress.metro.ru} id="metroDistance" type="number">
                </div>
            </div>
        </div>
        {/if}

        {#if estateTemplate.type==="flat"}
        <div  class="prop prop-vertical">
            <label for="zk">Жилой комплекс</label>
            <input type="text" id="zk" bind:value={estateTemplate.adress.zk.ru}>
        </div>
        {/if}


        <!-- 
            ESTATE DETAILS 
        -->
        <div class="prop prop-vertical" style="margin-top: 2em;">
            <h3 style="border-top: 1px dashed #333;padding-top: 1.5em;">{estateTemplate.type==="land"?"Площадь участка":estateTemplate.type==="commersion"?"Общая площадь":"Площадь"}</h3>
            <div class="options-horizontal">
                {#if estateTemplate.type==="land"||estateTemplate.type==="commersion"}
                <div style="position: relative;" class="area-input-wrapper" class:postfix-sotki={estateTemplate.type === "land"} class:postfix-m2={estateTemplate.type === "commersion"}>
                    <input step="0.01" type="number" bind:value={estateTemplate.details.area[estateTemplate.type==="land"?"whole":"g"]}>
                </div>
                {:else}
                    {#each ["g", "l", "k", "whole"] as areaProp}
                    <div style="display:{estateTemplate.type==="flat"&&areaProp==="whole"?"none":""}" class="prop-vertical area-prop">
                        <label for={areaProp}>{areaProp==="g"?"Общая":areaProp==="l"?"Жилая":areaProp==="k"?"Кухни":"Участка"}</label>
                        <div style="position: relative;" class="area-input-wrapper" class:postfix-sotki={areaProp === "whole"} class:postfix-m2={areaProp !== "whole"}>
                            <input step="0.01" type="number" id={areaProp} bind:value={estateTemplate.details.area[areaProp]}>
                        </div>
                    </div>
                    {/each}
                {/if}
            </div>
        </div>
        {#if estateTemplate.type!=="land"}
        <div  class="prop prop-vertical">
            <label for="sillings">Высота потолков</label>
            <div class="options-horizontal">
            <div style="position: relative;margin: 0 0.5em;max-width: 100px;" class="postfix-m">
                <input step="0.01" style="max-width: 100px;" type="number" id="sillings" bind:value={estateTemplate.details.sillings}>
            </div>
            </div>
        </div>
        <div  class="prop prop-vertical">
            <label for="sillings">Этажность</label>
            <div class="options-horizontal">
                <div class="prop-vertical area-prop">
                    <label for="floor">{estateTemplate.type==="house"?"Этажей в доме":"Этаж"}</label>
                    <div style="position: relative;" class="area-input-wrapper">
                        <input type="number" id="floor" bind:value={estateTemplate.details[estateTemplate.type==="house"?"gfloor":"floor"]}>
                    </div>
                </div>
                {#if estateTemplate.type!=="house"}
                <div class="prop-vertical area-prop">
                    <label for="gfloor">Этажей в здании</label>
                    <div style="position: relative;" class="area-input-wrapper">
                        <input type="number" id="gfloor" bind:value={estateTemplate.details.gfloor}>
                    </div>
                </div>
                {/if}
            </div>
        </div>
        {/if}
        {#if estateTemplate.type==="land"}
        <div  class="prop prop-vertical">
            <h3>Назначение земли</h3>
            <Select selectedValue={estateTemplate.details.purpose&&landTypes.find(el=>estateTemplate.details.purpose.includes(el.value))} bind:this={purposeSelector} placeholder="Не указанo" items={landTypes} on:clear={()=> estateTemplate.details.purpose = undefined} on:select={({detail}) => estateTemplate.details.purpose = detail.value} ></Select>
        </div>
        {/if}
        {#if estateTemplate.type==="house"||estateTemplate.type==="flat"}
        <div  class="prop prop-vertical">
            <label for="rooms">Количество комнат</label>
            <div class="options-horizontal">
            <div style="position: relative;margin: 0 0.5em;max-width: 100px;">
                <input style="max-width: 100px;" type="number" id="rooms" bind:value={estateTemplate.details.rooms}>
            </div>
            </div>
        </div>
        <div class="prop prop-vertical">
            <h3>Состояние {estateTemplate.type==="house"?"дома":"квартиры"}</h3>
            <div class="options-horizontal">
                <button type="button" class:active={estateTemplate.details.state} on:click={()=>estateTemplate.details.state=true}>Новое</button>
                <button type="button" class:active={!estateTemplate.details.state} on:click={()=>estateTemplate.details.state=false}>Вторичка</button>
            </div>
        </div>
        <div class="prop prop-vertical">
            <h3>Дополнительно</h3>
            {#if estateTemplate.type==="flat"}
            <Select selectedValue={estateTemplate.extras.included&&flatExtras.filter(el=>estateTemplate.extras.included.includes(el.value))} bind:this={extrasSelector} noOptionsMessage="Пусто" showIndicator={!estateTemplate.extras.included} isMulti placeholder="" items={flatExtras} on:clear={()=>estateTemplate.extras.included=undefined} on:select={({detail}) => estateTemplate.extras.included = detail ? detail.map(el=> el.value) : undefined } />
            {:else}
            <Select selectedValue={estateTemplate.extras.included&&houseExtras.filter(el=>estateTemplate.extras.included.includes(el.value))} bind:this={extrasSelector} noOptionsMessage="Пусто" showIndicator={!estateTemplate.extras.included} isMulti placeholder="" items={houseExtras} on:clear={()=>estateTemplate.extras.included=undefined} on:select={({detail}) => estateTemplate.extras.included = detail ? detail.map(el=> el.value) : undefined } />
            {/if}
        </div>
        {/if}
        {#if estateTemplate.type==="commersion"||estateTemplate.type==="flat"}
        <div  class="prop prop-vertical">
            <h3>Фонд</h3>
            <div class="options-horizontal">
                <button type="button" class:active={estateTemplate.details.fond} on:click={()=>estateTemplate.details.fond=true}>Жилой</button>
                <button type="button" class:active={!estateTemplate.details.fond} on:click={()=>estateTemplate.details.fond=false}>Нежилой</button>
            </div>
        </div>
        <div  class="prop prop-vertical">
            <h3>Планировка</h3>
            {#if estateTemplate.type==="flat"}
            <Select selectedValue={estateTemplate.details.planning&&flatPlanning.find(el=>el.value===estateTemplate.details.planning)} bind:this={planningSelector} placeholder="Не указана" items={flatPlanning} on:clear={()=> estateTemplate.details.planning = undefined} on:select={({detail}) => estateTemplate.details.planning = detail.value} ></Select>
            {:else}
            <Select selectedValue={estateTemplate.details.planning&&[{value: "open", label: "Открытого типа"}, {value: "close", label: "Закрытого типа"}].find(el=>el.value===estateTemplate.details.planning)} bind:this={planningSelector} placeholder="Не указана" items={[{value: "open", label: "Открытого типа"}, {value: "close", label: "Закрытого типа"}]} on:clear={()=> estateTemplate.details.planning = undefined} on:select={({detail}) => estateTemplate.details.planning = detail.value} ></Select>
            {/if}
        </div>
        {/if}
        {#if estateTemplate.type==="house"||estateTemplate.type==="land"}
        <div  class="prop prop-vertical">
            <h3>Коммуникации</h3>
            <Select selectedValue={estateTemplate.details.communications&&communicationsList.filter(el=>estateTemplate.details.communications.includes(el.value))} bind:this={communicationsSelector} noOptionsMessage="Пусто" showIndicator={!estateTemplate.details.communications} isMulti placeholder="Никаких" items={communicationsList} on:clear={()=>estateTemplate.details.communications=undefined} on:select={({detail}) => estateTemplate.details.communications = detail ? detail.map(el=> el.value) : undefined } />
        </div>
        {/if}
        <div class="prop prop-vertical">
            <div class="option-horizontal">
                <input id="fee" type="checkbox" bind:checked={estateTemplate.extras.fee}>
                <label class:active={estateTemplate.extras.fee} for="fee">Комиссия</label>
            </div>
            <div class="option-horizontal">
                <input id="top" type="checkbox" bind:checked={estateTemplate.extras.top}>
                <label class:active={estateTemplate.extras.top} for="top">В топ</label>
            </div>
            <div class="option-horizontal">
                <input id="hide" type="checkbox" bind:checked={estateTemplate.isHidden}>
                <label use:tooltip title="Скройте объявление от пользователей" style="display:flex;" class:active={estateTemplate.isHidden} for="hide">
                    Скрыть объявление
                    <svg style="pointer-events: none;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </label>
            </div>
        </div>

        <!-- 
            ESTATE PHOTOS, COMMENT AND NOTE 
        -->
        <div class="prop prop-vertical" style="margin-top: 2em;">
            <label style="border-top: 1px dashed #333;padding-top: 1.5em;" for="areaComment">Ваш комментарий</label>
            <textarea bind:value={estateTemplate.extras.comment.ru} name="areaComment" id="areaComment" cols="30" rows="10"></textarea>
        </div>
        {#if mounted}
        <div class="prop prop-vertical">
            <h3>Изображения {estateTemplate.type==="house"?"дома":estateTemplate.type==="flat"?"квартиры":estateTemplate.type==="commersion"?"недвижимости":"участка"}</h3>
            <Dropzone containerClasses={estateTemplate.images[0] ? "hascontent" : "nocontent"} on:drop={({detail: {acceptedFiles: imgs}})=> handleCompressImages(imgs)} accept="image/*" />
            {#if estateTemplate.images[0]}
                <div class="reorganize" on:click={()=> expanded = !expanded} class:expanded>
                    <span>Реорганизуйте {estateTemplate.images.length} {estateTemplate.images.length ==1 ? "загруженное" : "загруженных"} 
                        {estateTemplate.images.length == 1 ? "изображение" : estateTemplate.images.length <= 4 ? "изображения" : "изображений"}
                    </span>
                    {#if !expanded}
                    <svg style="width: 24px; height: 24px;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z" />
                    </svg>
                    {:else}
                    <svg style="width: 24px; height: 24px;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" />
                    </svg>
                    {/if}
                </div>
                <div class="images-wrapper" class:expanded>
                    <DragDropList removesItems bind:data={estateTemplate.images} />
                </div>
            {/if}
        </div>
        {/if}
        <div class="prop prop-vertical" style="margin-top: 2em;">
            <label style="border-top: 1px dashed #333;padding-top: 1.5em;" for="areaNote">Ваша личная заметка</label>
            <textarea bind:value={estateTemplate.note} name="areaNote" id="areaNote" cols="30" rows="10"></textarea>
        </div>
        
        <!-- 
            CONTROLS
         -->
         <div class="controls-wrapper">
            {#if estateToEdit}
            <button class="delete" on:click={()=>deleteMode=true} disabled={isLoading} type="submit" >
                {#if !isLoading}
                Удалить объявление
                {:else}
                <BarLoader size="100" color="#d7dada" unit="px"/>
                {/if}
            </button>
            {/if}
            <button style="{!estateToEdit&&"margin-left: auto;"}" on:click={()=>deleteMode=false} disabled={isLoading} type="submit" >
                {#if !isLoading||(deleteMode&&isLoading)}
                {estateToEdit?"Редактировать":"Создать объявление"}
                {:else}
                <BarLoader size="100" color="#d7dada" unit="px"/>
                {/if}
            </button>
         </div>
    </form>
</div>