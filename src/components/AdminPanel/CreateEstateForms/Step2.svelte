<script>
    import Select from 'svelte-select';
    import axios from "axios";
    import {LinkIcon} from "svelte-feather-icons";
    import { countries1, kyivDistricts } from "../../../helpers/locations";
    export let country, city, street, carousel, district, estateNumber;
    const VISIKOM_API_KEY = "85a077cf7ed46a021024c8e1066aaabb";
    
    let cityLabel, streetSelector, estateNumberActive = false, estateNumberInput, districtSelector, districtIdx;

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
    const loadStreetsAsync = (filterText) => {
    return new Promise((resolve, reject) => {
      axios.get(`https://api.visicom.ua/data-api/4.0/ru/search/adr_street.json?text=Украина,%20${city.ru},%20${filterText}&key=${VISIKOM_API_KEY}`)
      .then(response => resolve(response.data.type === "Feature" ? [response.data] : response.data.features.filter(street => street.properties.settlement === city.ru)))
      .catch(err => reject(err.response))
  });
    }
    const loadCitiesAsync = (filterText) => {
    return new Promise((resolve, reject) => {
      axios.get(`https://api.visicom.ua/data-api/4.0/ru/search/adm_settlement.json?text=Украина,%20${filterText}&key=${VISIKOM_API_KEY}`)
      .then(response => resolve(response.data.type === "Feature" ? [response.data] : response.data.features))
      .catch(err => reject(err.response))
  });
}

    const handleCountrySelect = (detail) => {
        console.log(detail);
        country = detail.value;
        handleClear("country");
    }
    const handleCitySelect = (detail) =>{
        cityLabel = detail.properties.type.charAt(0).toUpperCase() +  detail.properties.type.slice(1);
        city.ru = detail.properties.name;
        handleClear("city")
    }
    const handleStreetSelect = (detail) =>{
        console.log(detail);
        street.ru = detail.properties.name;
        if(detail.properties.name_en){
            street.en = detail.properties.name_en;
        }
        if(detail.properties.zone){
            district = kyivDistricts.find(el=> el.label.toLowerCase() === detail.properties.zone.toLowerCase());
            districtIdx = kyivDistricts.map(el => el.label.toLowerCase()).indexOf(detail.properties.zone.toLowerCase());
        }else{
            district = null;
        }
    }
    const handleDistrictSelect = (detail) =>{
        district = detail.value;
    }
    const handleClear = (from) => {
        if(from === "city"){
            street.ru = undefined;
            estateNumber = undefined;
            streetSelector.handleClear();
            if(districtSelector)districtSelector.handleClear();
            street.ru = undefined;
            district = undefined;
            estateNumberActive = false;
        }
        if(from === "country"){
            estateNumberActive = false;
            city.ru = undefined;
            street.ru = undefined;
            estateNumber = undefined;
        }
        if(from === "street"){
            street.ru = undefined;
            estateNumber = undefined;
            district = undefined;
            if(districtSelector)districtSelector.handleClear();
        }
    }

</script>

<style>
    .street-select-wrapper{
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        align-items: center;
    }
     
    .house-number{
        display: flex;
        align-items: center;
    }

    .house-number :global(svg), .house-number span{
        color: darkgrey;
        margin-left: 1em;
    }
    .house-number .icon-wrapper{
        z-index: 1;
    }
    .house-number.estateNumberActive :global(svg){
        color: #6262db;
    }
    .house-number.estateNumberActive span{
        color: black;
    }
    @media only screen and (max-width: 500px) {
        .house-number{
            margin-top: 1em;
        }
        .house-number input{
            max-width: 50%;
        }
    }
</style>

<div class="second-step step">
    <div class="props-wrapper">
    <div class="prop">
        <span class="prop-header">Страна</span>
        <Select containerClasses="country-select" items={countries1} isClearable={false} isSearchable={false} selectedValue={countries1[0]} on:select={({detail})=>handleCountrySelect(detail)} />
    </div>
    <div class="prop">
        <span class="prop-header">{cityLabel && country === "UA" ? cityLabel : "Город"}</span>
        {#if country === "UA"}
        <Select hideEmptyState placeholder="Введите название населенного пункта..." loadOptions={loadCitiesAsync} {optionIdentifier} {getSelectionLabel} {getOptionLabel}  on:select={({detail}) => handleCitySelect(detail)} on:clear={()=> handleClear("city")}></Select>
        {:else}
        <input bind:value={city.ru} placeholder="Введите название населенного пункта..." type="text">
        {/if}
    </div>
    <div class="prop">
        <span class="prop-header">Улица</span>
        <div class="street-select-wrapper">
            {#if country === "UA"}
            <Select on:clear={()=>handleClear("street")} bind:this={streetSelector} isDisabled={city.ru == undefined} hideEmptyState placeholder="Введите название улицы..." loadOptions={loadStreetsAsync} {optionIdentifier} {getSelectionLabel} {getOptionLabel}  on:select={({detail}) => handleStreetSelect(detail)} ></Select>
            {:else}
            <input disabled={city.ru == undefined} bind:value={street.ru} placeholder="Введите улицу..." type="text">
            {/if}
            <div class="house-number" class:estateNumberActive={estateNumberActive && street.ru ? true:false}>
                <div class="icon-wrapper" style={`cursor: ${street.ru?"pointer":"default;"}`} on:click={()=> {
                    if(!city.ru) return;
                    estateNumberInput.value='';estateNumber = undefined;
                    estateNumberActive = !estateNumberActive;
                }} >
                    <LinkIcon size="24" />
                </div>
                <span style="margin: 0 1em;">дом:</span> <input bind:this={estateNumberInput} disabled={city.ru && estateNumberActive ? false : true} type="number" bind:value={estateNumber}></div> 
            </div>
           
    </div>
    {#if city.ru === "Киев" && country === "UA"}
    <div class="prop">
        <span class="prop-header">Район</span>
        <Select placeholder="Введите название района..." selectedValue={district ?kyivDistricts[districtIdx] : null} isDisabled={street.ru == undefined ? true : false} containerClasses="district-select" bind:this={districtSelector} items={kyivDistricts}  on:select={({detail}) => handleDistrictSelect(detail)} />

    </div>
    {/if}
    </div>

    <div class="controls">
        <div class="prev-button" on:click={()=> carousel.go(0)}>
            <span>Предыдущий шаг</span>
        </div>
        <div class="next-button" on:click={()=> carousel.go(2)}>
            <span>Следующий шаг</span>
        </div>
    </div>
</div>
