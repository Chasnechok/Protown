<script context="module">
	export async function preload(page, session) {
		const { agentIdentifier, token, visikom } = session;
        if(!agentIdentifier) {
            return this.redirect(302, 'logadmin');
        }
        const fetchUser = await this.fetch(`user/${agentIdentifier}`);
		const user = await fetchUser.json();
        const fetchCourses = await this.fetch("/getCourses");
        const changeRates = await fetchCourses.json();
        return { agentIdentifier, token, user, visikom, changeRates }
	}
</script>

<script>
    import ControlPanel from "../components/AdminPanel/ControlPanel.svelte";
    import CreateForm from "../components/AdminPanel/CreateForm.svelte";
    import Settings from "../components/AdminPanel/Settings.svelte";
    import Notification from "../components/AdminPanel/Notification.svelte";
    export let agentIdentifier;
    export let token;
    export let user;
    export let visikom;
    export let changeRates;
    let notifications = [];
    // add, list, settings
    let mode = "add";
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
    .notifications {
        position: fixed;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        left: 50%;
        transform: translateX(-50%);
        z-index: 999;
    }
</style>

<svelte:head>
	<title>Админка 😎</title>
</svelte:head>

<section>
    <div class="notifications">
        {#each notifications as notification}
            <Notification bind:notifications {notification} />
        {/each}
    </div>
    <ControlPanel bind:mode />
    <fieldset>
        <legend>{mode==="add"?"Создание объявления ✍️":mode==="list"?"Список объявлений 📑":"Настройки ⚙️"}</legend>
        {#if mode === "add"}
        <CreateForm {addNotification} {visikom} {token} {agentIdentifier} />
        {:else if mode==="list"}
        В разработке
        {:else if mode==="settings"}
        <Settings {user} {changeRates} {agentIdentifier} />
        {/if}
    </fieldset>
    
</section>

