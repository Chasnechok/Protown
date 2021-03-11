<script>
    import Checkbox from "svelte-checkbox";
    import Select from 'svelte-select';
    import { flatPlanning, communicationsList, landTypes } from "../../../helpers/locations"
    export let floor, gfloor, sillings, whole, global_area, local_area, kitchen_area, rooms, state, zk, carousel, type, planning, communications, fond, partly, purpose;
    let units = "sot", transfer_area;
    $: if(transfer_area){
        global_area = units === "ga" ? transfer_area * 100 : transfer_area;
    }
    let zkActive = false;
    let zkLanguage = "ru";
    const languages = [{value: "ru", label:"Русский"}, {value: "en", label:"Английский"}, {value: "ua", label:"Украинский"}];

 
    
</script>

<style>
    .multiple-props, .buttons_states{
       display: grid;
       grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
       gap: 1em;
    }
    .type-button{
        padding: 0.5em 2em !important;
    }
    .zk-prop{
        flex-direction: row !important;
        flex-wrap: wrap;
        align-items: center;
        min-height: 49px;
    }
    .land-checkbox{
        display: flex;
        align-items: center;
        margin: 2em 0;
    }
    .zk-prop input{
        min-width: 20em;
        margin-left: 1em;
    }
    .input-postfix::after{
        content: "м²"
    }
    .input-postfix.sotka::after{
        content: "соток"
    }

    @media only screen and (max-width: 500px){
        .zk-prop input{
            margin-left: 0;
            margin-top: 1em;
            min-width: 100%;
        }
        .floors-wrapper{
            display: flex;
            flex-direction: column;
            align-items: center; 
        }
        }
</style>

<div class="third-step step">
<div class="props-wrapper">
{#if type === "flat"}
    <div class="multiple-props">
        <div class="prop">
            <span class="prop-header">Этаж</span>
            <div class="floors-wrapper">
                <input style="max-width: 3em;" bind:value={floor} type="number">
                <span>из</span>
                <input style="max-width: 3em;" bind:value={gfloor} type="number">
            </div>
            
        </div>
        <div class="prop" >
            <span class="prop-header">Количество комнат</span>
            <input style="max-width: 3em;" bind:value={rooms} type="number">
        </div>
        <div class="prop">
            <span class="prop-header">Высота потолков</span>
            <input style="max-width: 3em;" bind:value={sillings} type="number">
        </div>
    </div>
    
    <div class="prop">
        <span class="prop-header">Площадь</span>
        <div class="multiple-props">
            <div class="prop input-postfix"><span>Общая</span><input bind:value={global_area} type="number"></div>
            <div class="prop input-postfix"><span>Жилая</span><input bind:value={local_area} type="number"></div>
            <div class="prop input-postfix"><span>Кухня</span><input bind:value={kitchen_area} type="number"></div>
        </div>
    </div>
    <div class="multiple-props">

    <div class="prop">
        <span class="prop-header">Состояние квартиры</span>
        <div class="buttons_states">
            <div class="type-button" class:active={state} on:click={()=>state=true}>Новое</div>
            <div class="type-button" class:active={!state} on:click={()=>state=false}>Вторичка</div>
        </div>
    </div>

    <div class="prop planning" >
        <span class="prop-header">Планировка</span>
        <Select placeholder="Не указана" items={flatPlanning} on:clear={()=> planning = undefined} on:select={({detail}) => planning = detail.value} ></Select>
    </div>
 
    </div>

    <div class="prop zk-prop">
        
        <Checkbox
                size="1.3em"
                duration=500
                primaryColor="rgba(98, 98, 219, 0.8)"
                bind:checked = {zkActive}>
        </Checkbox>
        <span class="prop-header" class:inactive={!zkActive} style="margin: 4px 1em 0px 1em;">Жилой комплекс</span>
        {#if zkActive}
        <Select showIndicator selectedValue={languages[0]} items={languages} isClearable={false} on:select={({detail}) => zkLanguage = detail.value} ></Select>
            {#if zkLanguage === "ru"}
            <input type="text" bind:value={zk.ru} placeholder={`Название ж/к на русском`} />
            {:else if zkLanguage === "en"}
            <input type="text" bind:value={zk.en} placeholder={`Название ж/к на английском`} />
            {:else}
            <input type="text" bind:value={zk.ua} placeholder={`Название ж/к на украинском`} />
            {/if}
        {/if}
    </div>
   
    {:else if type === "house"}
    <div class="multiple-props">
        <div class="prop">
            <span class="prop-header">Этажность дома</span>
            <input style="max-width: 3em;" bind:value={gfloor} type="number">
        </div>
        <div class="prop" >
            <span class="prop-header">Количество комнат</span>
            <input style="max-width: 3em;" bind:value={rooms} type="number">
        </div>
        <div class="prop">
            <span class="prop-header">Высота потолков</span>
            <input style="max-width: 3em;" bind:value={sillings} type="number">
        </div>
    </div>
    <div class="prop">
        <span class="prop-header">Площадь</span>
        <div class="multiple-props">
            <div class="prop input-postfix"><span>Общая</span><input bind:value={global_area} type="number"></div>
            <div class="prop input-postfix"><span>Жилая</span><input bind:value={local_area} type="number"></div>
            <div class="prop input-postfix"><span>Кухня</span><input bind:value={kitchen_area} type="number"></div>
            <div class="prop input-postfix sotka"><span>Участок</span><input bind:value={whole} type="number"></div>
        </div>
    </div>
    <div class="prop">
        <span class="prop-header">Состояние дома</span>
        <div class="buttons_states">
            <div class="type-button" class:active={state} on:click={()=>state=true}>Новое</div>
            <div class="type-button" class:active={!state} on:click={()=>state=false}>Вторичка</div>
        </div>
    </div>
    
    <div class="prop">
        <span class="prop-header">Коммуникации</span>
        <Select showIndicator={!communications} isMulti placeholder="" items={communicationsList} on:clear={()=>communications=undefined} on:select={({detail}) => communications = detail ? detail.map(el=> el.value) : undefined } />
    </div>
    
    {:else if type === "commersion"}
    <div class="multiple-props">
        <div class="prop">
            <span class="prop-header">Этаж</span>
            <div>
                <input style="max-width: 3em;" bind:value={floor} type="number">
                <span>из</span>
                <input style="max-width: 3em;" bind:value={gfloor} type="number">
            </div>
            
        </div>
        <div class="prop">
            <span class="prop-header">Высота потолков</span>
            <input style="max-width: 3em;" bind:value={sillings} type="number">
        </div>
    </div>
    <div class="prop">
        <span class="prop-header">Общая площадь</span>
        <div class="prop input-postfix" style="max-width: fit-content;"><input bind:value={global_area} type="number"></div>
    </div>
    <div class="multiple-props">
        <div class="prop">
            <span class="prop-header">Фонд</span>
            <div class="buttons_states">
                <div class="type-button" class:active={fond} on:click={()=>fond=true}>Жилой</div>
                <div class="type-button" class:active={!fond} on:click={()=>fond=false}>Нежилой</div>
            </div>
        </div>
        <div class="prop planning" >
            <span class="prop-header">Планировка</span>
            <Select placeholder="Не указана" items={[{value: "open", label: "Открытого типа"}, {value: "close", label: "Закрытого типа"}]} on:clear={()=> planning = undefined} on:select={({detail}) => planning = detail.value} ></Select>
        </div>
    </div>
    
    {:else if type === "land"}
    <div class="prop land-area">
        <span class="prop-header">Площадь земли</span>
        <div style="display: flex;gap: 1em;">
            <Select placeholder="" selectedValue={{value: "sot", label: "Сотки"}} items={[{value: "ga", label: "Гектары"}, {value: "sot", label: "Сотки"}]} isSearchable={false} isClearable={false} on:select={({detail})=> units = detail.value} />
            <input type="number" style="max-width: 50%;" bind:value={transfer_area}>
        </div>
    </div>

    <div class="land-checkbox">
        <Checkbox
        size="1.3em"
        duration=500
        primaryColor="rgba(98, 98, 219, 0.8)"
        bind:checked = {partly}>
        </Checkbox>
        <span class="prop-header" class:inactive={!partly} style="margin: 0 0 0 .5em;">Покупка по частям</span>
    </div>
    <div class="" >
        <span class="prop-header">Предназначение земли</span>
        <Select placeholder="Не указанo" items={landTypes} on:clear={()=> planning = undefined} on:select={({detail}) => purpose = detail.value} ></Select>
    </div>
    

{/if}
</div>
<div class="controls">
    <div class="prev-button" on:click={()=> carousel.go(1)}>
        <span>Предыдущий шаг</span>
    </div>
    <div class="next-button" on:click={()=> carousel.go(3)}>
        <span>Следующий шаг</span>
    </div>
</div>
</div>
