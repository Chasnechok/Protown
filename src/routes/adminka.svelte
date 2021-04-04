<script context="module">
	export async function preload({ query }, session) {
        const { mode, id, page } = query;
        // check if user is logged in
		const { agentIdentifier, visikom } = session;
        if(!agentIdentifier) {
            return this.redirect(302, 'logadmin');
        }
        // define things to fech
        let user, estateToEdit, changeRates;
        const fetchUser = await this.fetch(`user/${agentIdentifier}`);
		user = await fetchUser.json();
        const fetchCourses = await this.fetch("/getCourses");
        changeRates = await fetchCourses.json();
        if(mode==="edit"&&id) {
            const fetchEstateToEdit = await this.fetch(`estates/${id}`);
		    estateToEdit = await fetchEstateToEdit.json();
            if(!estateToEdit) return this.redirect(302, 'adminka');
        }
        return { agentIdentifier, user, visikom, changeRates, mode, estateToEdit, page }
	}
</script>

<script>
    import ControlPanel from "../components/AdminPanel/ControlPanel.svelte";
    import CreateForm from "../components/AdminPanel/CreateForm.svelte";
    import List from "../components/AdminPanel/List.svelte";
    import Settings from "../components/AdminPanel/Settings.svelte";
    import Notification from "../components/AdminPanel/Notification.svelte";
    import { setContext } from "svelte";
    export let agentIdentifier;
    export let user;
    export let visikom;
    export let changeRates;
    export let page;
    setContext("changeRates", changeRates);
    let bufferedEstates;
    let pagesCount = 1;
    let notifications = [];
    // add, list, settings
    export let mode = "list";
    export let estateToEdit;
    const addNotification = (notification, duration) => {
        if(!notification||(!notification.message&&!notification.code)) return;
        notifications = [notification, ...notifications];
        if(duration) {
            setTimeout(()=>notifications=notifications.filter(el=>el.message!==notification.message), duration)
        }
    }

</script>

<style>
    section {
        display: flex;
        flex-wrap: wrap;
        position: relative;
    }
    fieldset {
        border: none;
        border-top: 1px solid #333;
        width: 100%;
        flex: 1;
    }
    legend {
        padding: 0 2em;
        margin: 0 auto;
        font-size: 22px;
    }
    :global(fieldset>*){
        --indicatorColor: rgb(98, 98, 219, 0.7);
        --itemIsActiveBG: rgb(98, 98, 219, 0.9);
        --spinnerColor: rgb(98, 98, 219, 0.9);
        --multiItemActiveBG: rgb(98, 98, 219, 0.9);
        --multiClearHoverFill: rgb(98, 98, 219, 0.7); 
        --multiClearBG: #53537db3;
        --itemHoverBG: rgb(98, 98, 219, 0.1);
        --multiItemBG: rgb(98, 98, 219, 0.2);
        --borderFocusColor: rgb(98, 98, 219, 0.7);
        --borderHoverColor: rgb(98, 98, 219, 0.5);
        --multiSelectItemTextColor: #000000ab;
    }
    .notifications-wrapper {
	    position: fixed !important;
	    left: 50%;
	    top: 6.5em;
	    transform: translateX(-50%);
	    z-index: 999;
    }
    
    @media only screen and (max-width: 374px) {
        legend {
            font-size: 20px;
        }
    }
</style>

<svelte:head>
	<title>Админка 😎</title>
</svelte:head>

<section>
    <div class="notifications-wrapper">
        {#each notifications as notification}
            <Notification bind:notifications {notification} />
        {/each}
    </div>
    <ControlPanel bind:mode />
    <fieldset>
        <legend>{mode==="add"?"Создание объявления ✍️":mode==="settings"?"Настройки ⚙️":mode==="edit"?"Редактировать":"Список объявлений 📑"}</legend>
        {#if mode === "add"}
        <CreateForm {addNotification} {visikom} {agentIdentifier} />
        {:else if mode==="settings"}
        <Settings bind:user {changeRates} {agentIdentifier} {addNotification} />
        {:else if mode==="edit"&&estateToEdit}
        <CreateForm bind:mode {addNotification} {visikom} {agentIdentifier} {estateToEdit} />
        {:else}
        <List bind:page bind:bufferedEstates bind:pagesCount />
        {/if}
    </fieldset>
    
</section>

