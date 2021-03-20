<script>
    import { stores } from '@sapper/app';
	import axios from "axios";
    import { createBlankEstate } from "../helpers/converter";
    import LoginForm from "../components/AdminPanel/LoginForm.svelte";
    import Carousel from '@beyonk/svelte-carousel';
    import { onMount } from "svelte";
    import LdsSpinner from "../helpers/LdsSpinner.svelte";
    import Step1 from "../components/AdminPanel/CreateEstateForms/Step1.svelte";
    import Step2 from "../components/AdminPanel/CreateEstateForms/Step2.svelte";
    import Step3 from "../components/AdminPanel/CreateEstateForms/Step3.svelte";
    import Step4 from "../components/AdminPanel/CreateEstateForms/Step4.svelte";
    import Step5 from "../components/AdminPanel/CreateEstateForms/Step5.svelte";

    
    let carousel;
	const { session } = stores();
    $: console.log($session.agentIdentifier);
    let mounted = false, showSuccess = false;
    let page = "create";
    let newEstate;
    let images = [];

    if($session.token) newEstate = createBlankEstate();
    onMount(()=>{ mounted=true })

    const handleLogout = async () => {
		axios.post('/auth/logout')
		.then(() => {
			$session.token = undefined
		})
		.catch(err => console.log(err))
	}

    const removeUnde = (obj) => {
        for(let key in obj){
            if (obj[key] instanceof Object && obj[key] !== undefined){
                removeUnde(obj[key]);
            }
            if(obj[key] == undefined){
                delete obj[key];
            }
        }
    }

    const createNewEstate = () => {
        let temp = newEstate;
        const estate = new FormData();
        estate.append("agent", $session.agentIdentifier);
        removeUnde(temp);
        console.log(temp);

        for(let key in temp){
            if(newEstate[key] instanceof Object){
                estate.append(key, JSON.stringify(newEstate[key]));
            } else {
                estate.append(key, newEstate[key]);
            }
        }
        if(images[0]){
            console.log(images);
            images.forEach(img => {
                estate.append(img.id, img.image, img.image.name);
            });
        }
        axios({
            method: "post",
            url: "/estates/create",
            data: estate,
            headers: {
				'content-type': 'multipart/form-data',
				authorization: $session.token
			}
        })
        .then(res => {
            newEstate = createBlankEstate();
            carousel.go(0);
            showSuccess = true;
        })
        .catch(err => console.log(err.response))
    }


</script>

<style>
.success{
    display: none;
    position: absolute;
}
.success.showSuccess{
    display: block;
    position: absolute;
}
.logout-button{
    position: absolute;
    right: 0;
  }
.logout-button:hover, .nav-button:hover{
    cursor: pointer;
  }
.admin-navigation {
    display: flex;
    flex-wrap: wrap;
    background: #FFFFFF;
    box-shadow: 0px 0px 4px rgb(0 0 0 / 25%);
    border-radius: 10px;
    padding: 1em 2em;
    gap: 1em;
    margin: 0 auto 2em;
    max-width: 820px;
}
.nav-button {
    background: #E5E5E5;
    border-radius: 10px;
    padding: 1em;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
}
.nav-button.active {
    background: rgba(255, 255, 255, 0.06);
    box-shadow: inset 0px 0px 4px rgb(0 0 0 / 45%);
    border-radius: 10px;
}
.carousel-wrapper{
    max-width: 850px;
    margin: 0 auto;
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
}
.carousel-wrapper :global(.next-button){
    padding: 1em;
    border-radius: 10px;
    color: white;
    background-color: rgb(98 98 219 / 70%);
}
.carousel-wrapper :global(.prev-button){
    padding: 1em;
    border-radius: 10px;
    color: #5C5C5C;
    background-color: #E5E5E5;
}
.carousel-wrapper :global(.step){
    min-height: 460px;
    position: relative;
    background: #FFFFFF;
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
    border-radius: 10px;
    justify-content: space-between;
    margin: 1em;
    padding: 3em;
    display: flex;
    flex-direction: column;
}
.carousel-wrapper :global(.prop){
    display: flex;
    flex-direction: column;
    margin-bottom: 1em;
}
.carousel-wrapper :global(.prop-header){
    font-weight: 800;
    font-size: 18px;
    margin-bottom: 6px;
}


.carousel-wrapper :global(.prop > input, .prop input[type=number], .street-select-wrapper > input, textArea){
        color: #828282;
        font-size: 16px;
        padding: 0.5em;
        border: 0 solid #a9a9a9;
        border-radius: 5px 5px 2px 2px;
        background-color: #e5e5e56b;
        border-bottom: 2px solid #a9a9a9;
        max-width: 100%;
    }
.carousel-wrapper :global(.prop-header.inactive){
    color: darkgrey;
}
.carousel-wrapper :global(.prop > input:focus, .prop input[type=number]:focus, .street-select-wrapper > input:focus, textArea:focus){
        border: 0;
        outline: none;
        border-bottom: 2px solid #6262db;
        color: #676784;
    }
.carousel-wrapper :global(.buttons) {
        display: grid;
        gap: 1em;
        grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    }
.carousel-wrapper :global(.type-button) {
        background: #E5E5E5;
        border-radius: 10px;
        text-align: center;
        padding: 0.5em 0;
    }
.carousel-wrapper :global(.type-button.active) {
        background: #FFFFFF;
        box-shadow: inset 0px 0px 4px rgb(0 0 0 / 45%);
        border-radius: 10px;
    }

    .carousel-wrapper span{
    margin-left: 1em;
    font-weight: 800;
    font-size: 22px;
}
.carousel-wrapper :global(.type-button:hover, .next-button:hover, .prev-button:hover){
        cursor: pointer;
    }


.carousel-wrapper :global(.step .input-postfix){
        position: relative;
}
.carousel-wrapper :global(.step .input-postfix::after){
        position: absolute;
        font-size: 10px;
        top: 50%;
        transform: translateY(-50%);
        right: .5em;
        transition: all .05s ease-in-out;
}
.carousel-wrapper :global(.step .input-postfix:hover::after,.input-postfix:focus-within::after){
    right: 1.5em;
}
@supports (-moz-appearance:none) {
        .input-postfix::after {
        right: 1.5em;
    }
}
.carousel-wrapper :global(.step .controls){
        display: flex;
        justify-content: space-between;
        margin-top: 1em;
        gap: 1em;
}
@media only screen and (max-width: 500px) {
    .carousel-wrapper :global(.prop-header){
    font-weight: 600;
    font-size: 14px;
    margin-bottom: 6px;
    text-align: center;
    }
    .carousel-wrapper :global(.step){
    padding: 1.5em;
    }
    .nav-button {
        font-size: 12px;
    }
    .carousel-wrapper :global(.multiple-props .prop) {
        align-items: center;
    }
    }
</style>

<svelte:head>
	<title>{!$session.token ? "Admin login" : "Control panel"}</title>
</svelte:head>

{#if !$session.token}

 <LoginForm bind:newEstate {createBlankEstate} bind:token={$session.token} bind:agentIdentifier={$session.agentIdentifier} />

{:else}
<section class="admin-panel">
    <div class="success" class:showSuccess >Объявление было успешно создано!</div>
    <div class="logout-button button" on:click={()=>handleLogout()}>
        Выйти
    </div>
    <div class="admin-navigation">
        <div class="nav-button" class:active={page==="create"} on:click={()=>page="create"} >Создать объявление</div>
        <div class="nav-button" class:active={page==="list"} on:click={()=>page="list"}>Все объявления</div>
        <div class="nav-button" class:active={page==="stats"} on:click={()=>page="stats"}>Статистика</div>
    </div>
{#if mounted}

    {#if page==="create"}

        <div class="carousel-wrapper">
            <span>Создание объявления ✍️</span>
            <Carousel dots={false} startIndex={0} draggable={false} loop={false} bind:this={carousel} controls={false} perPage={1} > 
            
                <Step1 {carousel} bind:partly={newEstate.details.partly} bind:label={newEstate.label} bind:type={newEstate.type} bind:price={newEstate.price} bind:deal={newEstate.deal} bind:currency={newEstate.currency} bind:leased={newEstate.leased} />
                <Step2 {carousel} bind:estateNumber={newEstate.adress.estateNumber} bind:district={newEstate.adress.district} bind:country={newEstate.adress.country} bind:city={newEstate.adress.city} bind:street={newEstate.adress.street}  />
                <Step3 {carousel} type={newEstate.type} bind:planning={newEstate.details.planning} bind:sillings={newEstate.details.sillings} bind:purpose={newEstate.details.purpose} bind:fond={newEstate.details.fond} bind:communications={newEstate.details.communications} bind:floor={newEstate.details.floor} bind:gfloor={newEstate.details.gfloor} bind:whole={newEstate.details.area.whole} bind:global_area={newEstate.details.area.g} bind:local_area={newEstate.details.area.l} bind:kitchen_area={newEstate.details.area.k} bind:rooms={newEstate.details.rooms} bind:state={newEstate.details.state} bind:zk={newEstate.details.zk}/>
                <Step4 {carousel} type={newEstate.type} bind:extras={newEstate.extras} />
                <Step5 {carousel} bind:images {createNewEstate} />

            </Carousel>
        </div>
  
    {:else if page==="list"}
        <span>list</span>
    {:else}
    <span></span>
    {/if}

{:else}
<div class="spinner" style="display: flex; justify-content: center;">
    <LdsSpinner />
</div>

{/if}
    
</section>
{/if}