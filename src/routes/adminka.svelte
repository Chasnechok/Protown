<script context="module">
	export async function preload(page, session) {
		const { agentIdentifier, token, visikom } = session;
        if(!agentIdentifier) {
            return this.redirect(302, 'logadmin');
        }
        const res = await this.fetch(`user/${agentIdentifier}`);
		const user = await res.json();
        return { agentIdentifier, token, user, visikom }
	}
</script>

<script>
    import ControlPanel from "../components/AdminPanel/ControlPanel.svelte";
    import CreateForm from "../components/AdminPanel/CreateForm.svelte";
    export let agentIdentifier;
    export let token;
    export let user;
    export let visikom;
    // add, list, settings
    let mode = "add";

</script>

<style>
    section {
        display: flex;
        flex-wrap: wrap;
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
</style>

<svelte:head>
	<title>Админка 😎</title>
</svelte:head>

<section>
    <ControlPanel bind:mode />
    <fieldset>
        <legend>{mode==="add"?"Создание объявления ✍️":mode==="list"?"Список объявлений 📑":"Настройки ⚙️"}</legend>
        {#if mode === "add"}
        <CreateForm {visikom} />
        {/if}
    </fieldset>
    
</section>

