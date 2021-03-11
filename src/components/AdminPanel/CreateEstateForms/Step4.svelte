<script>

    import axios from "axios";
    import Checkbox from "svelte-checkbox";
    import Select from 'svelte-select';
    import { flatExtras } from "../../../helpers/locations";
    import {LinkIcon} from "svelte-feather-icons";
    export let extras, carousel, type;

    const VISIKOM_API_KEY = "85a077cf7ed46a021024c8e1066aaabb";
    const languages = [{value: "ru", label:"Русский"}, {value: "en", label:"Английский"}, {value: "ua", label:"Украинский"}];
  

    let metroActive = false, optionIdentifier = "id", distanceInput, metroDistanceActive = false, areaLanguage;
    $: if(!metroActive){
        Object.keys(extras.metro).forEach(key => extras.metro[key] = undefined);
    }
    const loadUndergroundsAsync = (filterText) => {
    return new Promise((resolve, reject) => {
      axios.get(`https://api.visicom.ua/data-api/4.0/ru/search/poi_underground_railway_station.json?intersect=STL1NQ7EP&text=${filterText}&key=${VISIKOM_API_KEY}`)
      .then(response => resolve(response.data.type === "Feature" ? [response.data] : response.data.features))
      .catch(err => reject(err.response))
    });
    }

    const getOptionLabel = (option) => {
        if(option.properties){
            return option.properties.name;
        }
        else {
            return option.label;
        }
    };
    const getSelectionLabel = (option) => getOptionLabel(option);
    const handleMetroSelect = (option) => {
        extras.metro.ru = option.properties.name;
        extras.metro.ua = option.properties.vitrine.match(/"(.*)"/)[1];
        extras.metro.distance = undefined;
    }

    
 
    
</script>

<style>
    .metro-distance.metroDistanceActive :global(svg){
        color: #6262db;
    }
    .metro-distance.metroDistanceActive span{
        color: black;
    }
    .metro-distance{
        display: flex;
        align-items: center;
    }

    .metro-distance :global(svg), .metro-distance span{
        color: darkgrey;
        margin-left: 1em;
    }
    .metro-distance .icon-wrapper{
        z-index: 1;
    }
    .metro-prop{
        align-items: center;
        flex-direction: row !important;
        min-height: 44px;
        margin-bottom: .2em !important;
    }
    .metro-prop :global(.selectContainer){
        flex: 1;
    }

    .areaComment{
        margin-top: 1em;
        width: 100%;
        height: 5.5em;
    }
    
</style>

<div class="fourth-step step">
<div class="props-wrapper">
{#if type === "flat" || type === "house"}
    
    <div class="prop">
        <span class="prop-header">Дополнительно</span>
        <Select listPlacement="bottom" showIndicator={!extras.included} isMulti placeholder="" items={type === "flat" ? flatExtras : [{value: "bas", label: "Бассейн"}, {value: "hoz", label: "Хоз. постройки"}, {value: "gar", label: "Гараж"}, ...flatExtras]} on:clear={()=>extras.included=undefined} on:select={({detail}) => extras.included = detail ? detail.map(el=> el.value) : undefined } />
    </div>

    <div class="prop metro-prop">
            <Checkbox
            size="1.3em"
            duration=500
            primaryColor="rgba(98, 98, 219, 0.8)"
            bind:checked = {metroActive}>
            </Checkbox>
            <span class="prop-header" class:inactive={!metroActive} style="margin: 3px 1em 0 1em;">Метро</span>

        
        {#if metroActive}
        <Select hideEmptyState placeholder="Введите станцию метро..." loadOptions={loadUndergroundsAsync} {optionIdentifier} {getSelectionLabel} {getOptionLabel}  on:select={({detail}) => handleMetroSelect(detail)}
             on:clear={()=> Object.keys(extras.metro).forEach(key => extras.metro[key] = undefined)} />

        <div class="metro-distance" class:metroDistanceActive={metroDistanceActive && extras.metro.ru ? true:false}>
            <div class="icon-wrapper" style={`cursor: ${extras.metro.ru?"pointer":"default;"}`} on:click={()=> {
                    if(!extras.metro.ru) return;
                    distanceInput.value=''; extras.metro.distance = undefined;
                    metroDistanceActive = !metroDistanceActive;
                }} >
                    <LinkIcon size="24" />
            </div>
            <span style="margin: 0 1em;">расстояние:</span> <input bind:this={distanceInput} disabled={extras.metro.ru && metroActive ? false : true} type="number" bind:value={extras.metro.distance}>
        </div>
        {/if}
    </div>
    {/if}
    <div class="prop metro-prop">
        <Checkbox
            size="1.3em"
            duration=500
            primaryColor="rgba(98, 98, 219, 0.8)"
            bind:checked = {extras.fee}>
            </Checkbox>
            <span class="prop-header" class:inactive={!extras.fee} style="margin: 3px 1em 0 1em;">Без комиссии</span>
    </div>
    <div class="prop metro-prop">
        <Checkbox
            size="1.3em"
            duration=500
            primaryColor="rgba(98, 98, 219, 0.8)"
            bind:checked = {extras.top}>
            </Checkbox>
            <span class="prop-header" class:inactive={!extras.top} style="margin: 3px 1em 0 1em;">В топ</span>
    </div>

    <div class="prop" style="flex-direction: row;flex-wrap: wrap;align-items: center;">
        <span class="prop-header" style="margin: 0 1em 0 0;">Комментарий</span>
        <Select showIndicator selectedValue={languages[0]} items={languages} isClearable={false} on:select={({detail}) => areaLanguage = detail.value} />
        {#if areaLanguage === "en"}
            <textarea placeholder="Ваш комментарий на английском" class="areaComment" bind:value={extras.comment.en} />
            {:else if areaLanguage === "ua"}
            <textarea placeholder="Ваш комментарий на украинском" class="areaComment" bind:value={extras.comment.ua} />
            {:else}
            <textarea placeholder="Ваш комментарий на русском" class="areaComment" bind:value={extras.comment.ru} />  
        {/if}
        
    </div>


</div>
<div class="controls">
    <div class="prev-button" on:click={()=> carousel.go(2)}>
        <span>Предыдущий шаг</span>
    </div>
    <div class="next-button" on:click={()=> carousel.go(4)}>
        <span>Следующий шаг</span>
    </div>
</div>
</div>
