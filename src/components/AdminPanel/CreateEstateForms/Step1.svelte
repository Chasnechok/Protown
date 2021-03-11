<script>
    import Checkbox from "svelte-checkbox";
    import Datepicker from 'svelte-calendar';
    import Select from 'svelte-select';
    import {daysOfWeek, monthsOfYear, currencyCalculator} from "../../../helpers/converter";
    import { changeRates } from "../../../helpers/parametres"
    export let label, type, price, deal, currency, leased, carousel;
    let leaseActive = false;
    const currencies = ["UAH", "USD", "EUR"];
</script>

<style>
    .controls{
        justify-content: flex-end !important;
    }
    .date-prop{
        flex-direction: row !important;
        align-items: center;
        min-height: 37.5px;
    }
    .input-postfix::after{
        content: "/ месяц";
    }
    
</style>

<div class="first-step step">
<div class="props-wrapper">
    <div class="prop">
        <span class="prop-header">Название</span>
        <input id="label" bind:value={label} type="text">
    </div>
    <div class="prop">
        <span class="prop-header">Тип недвижимости</span>
        <div class="buttons">
            <div class="type-button" on:click={()=> type="house"} class:active={type === "house"}><span>Дом</span></div>
            <div class="type-button" on:click={()=> type="flat"} class:active={type === "flat"}><span>Квартира</span></div>
            <div class="type-button" on:click={()=> type="commersion"} class:active={type === "commersion"}><span>Коммерция</span></div>
            <div class="type-button" on:click={()=> type="land"} class:active={type === "land"}><span>Участок</span></div>
        </div>
    </div>
    <div class="prop">
        <span class="prop-header">Тип сделки</span>
        <div class="buttons">
            <div class="type-button" on:click={()=> deal="buy"} class:active={deal === "buy"}><span>Продажа</span></div>
            <div class="type-button" on:click={()=> deal="lease"} class:active={deal === "lease"}><span>Аренда</span></div>
        </div>
    </div>
    {#if deal === "lease"}
    <div class="prop date-prop">
        <Checkbox
                size="1.3em"
                duration=500
                primaryColor="rgba(98, 98, 219, 0.8)"
                bind:checked = {leaseActive}>
        </Checkbox>
        <span class="prop-header" class:inactive={!leaseActive} style="margin: 3px 0 0 1em;">Уже сдано</span>
        {#if leaseActive}
        <span class="prop-header" style="margin: 3px 0 0 0;">&nbspи освобождается</span><Datepicker highlightColor='#6262db' start={new Date()} {daysOfWeek} {monthsOfYear} bind:selected ={leased}/>
        {/if}
    </div>
    {/if}
    <div class="prop">
        <span class="prop-header">Цена</span>
        <div class="buttons">
            <Select containerClasses="currency-select" items={currencies} isClearable={false} isSearchable={false} selectedValue={currency} on:select={({detail})=>currency=detail.value} />
            <div class:input-postfix={deal === "lease"} style="display: flex; position: relative;">
                <input style="margin: auto 0;" type="number" bind:value={price}>
            </div>
                
            
            <div class="courses" style="grid-column: span 2; display: flex;">
                {#if price}
                    {#if changeRates}
                    {#each currencies.filter(el=> el !== currency) as ccy}
                        <span class="currency" style="margin: auto 0; font-weight: 600;">&nbsp{ccy}:</span>
                        <span class="currency-value" style="margin: auto 0;">&nbsp {currencyCalculator(price, ccy, currency, $changeRates)}</span>
                    {/each}
                {:else}
                <span>&nbspзагрузка курсов...</span>
                {/if}
                {/if}
            </div>
        </div>
       
        
        
    </div>
</div>
    <div class="controls">
        <div class="next-button" on:click={()=> carousel.go(1)}>
            <span>Следующий шаг</span>
        </div>
    </div>
</div>
