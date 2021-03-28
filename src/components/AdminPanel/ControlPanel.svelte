<script>
    import axios from "axios";
    import { goto, stores } from "@sapper/app";
    const { session } = stores();
    export let mode = "add";
    
    const handleLogout = async () => {
		axios.post('/auth/logout')
		.then(() => {
            $session.token = undefined;
            $session.agentIdentifier = undefined;
			goto("/logadmin");
		})
		.catch(err => console.log(err))
	}
</script>

<style>
    .control-panel-wrapper {
        padding: 1em;
        flex: 1 1 100%;
    }
    .control-panel {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        border: 1px solid #e2e2e2;
        box-shadow: inset 0px 0px 6px rgb(0 0 0 / 15%);
        padding: 1em 2em;
        border-radius: .5em;
        max-width: 900px;
        margin: 0 auto;
    }
    button {
        border-radius: .5em;
        text-align: center;
        padding: 0.6em 1em;
        margin: 1em .5em;
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
    button:hover:not(.active), button:focus:not(.active) {
        cursor: pointer;
        letter-spacing: 1px;
        border-color: #6262db;
        color: #6262db;
    }
    button.logout:hover, button.logout:focus {
        border-color: #f16767;
        color: #f16767;
    }
    button.active {
        border-color: #6262db;
        color: #6262db;
    }
</style>

<div class="control-panel-wrapper">
    <div class="control-panel">
        <div class="user-info"></div>
        <button class:active={mode==="add"} on:click={()=>mode="add"}>
            Добавить объявление
        </button>
        <button class:active={mode==="list"} on:click={()=>mode="list"}>
            Список объявлений
        </button>
        <button class:active={mode==="settings"} on:click={()=>mode="settings"}>
            Настройки
        </button>
        <button on:click={handleLogout} class="logout">
            Выйти
        </button>
    </div>
</div>
