<script>
	import axios from "axios";
    import { AlertCircleIcon } from 'svelte-feather-icons';
    import { goto, stores } from "@sapper/app";
    import { BarLoader } from 'svelte-loading-spinners';
    const { session } = stores();
    let username, password, input1, input2;
    let invalidCredentials = false;
    let loading = false;
    
    $: error = username || password ? null : null;

	const handleLogin = async(username, password) => {
        loading = true;
		axios.post('/auth/login', {
		username: username,
		password: password
	})
	.then((res) => {
        $session.visikom = res.data.visikom;
        $session.agentIdentifier = res.data.agentIdentifier;
        goto("/adminka");
  })
  	.catch(err => {
        error = err.response.statusText;
        loading = false;
        invalidCredentials = true;
        setTimeout(()=>{
            invalidCredentials = false;
            password = null;
            username = null;
            input1.value = '';
            input2.value = '';
          }, 800)
	  })
	}

</script>

<style>
    .login-section{
        display: flex;
        justify-content: center;
        max-width: 1650px;
        margin: 6.5em auto 5em auto;
    }
    .login-section.invalidCredentials input{
        color: #ff6d6d;
        animation: invalidCredentials;
        animation-duration: 400ms;
        border-bottom: 2px solid #ff6d6d;
    }
    .login-section.invalidCredentials input#login{
        animation-direction: reverse;
    }
    @keyframes invalidCredentials{
        0%{
            transform: translateX(5px);
        }
        100%{
            transform: translateX(-5px);
        }
    }
    .login-form{
        min-width: 220px;
        background-color: white;
        display: flex;
        flex-direction: column;
        padding: 1em;
        border-radius: .5em;
        box-shadow: inset 0 0 6px rgb(0 0 0 / 15%);
        border: 1px solid #e2e2e2;
    }
    input{
        color: #828282;
        font-size: 16px;
        padding: 0.5em;
        border: 0 solid #a9a9a9;
        border-radius: 5px 5px 2px 2px;
        background-color: #e5e5e56b;
        border-bottom: 2px solid #a9a9a9;
    }
    input:focus{
        border: 0;
        outline: none;
        border-bottom: 2px solid #6262db;
        color: #676784;
    }
    .login-button{
        margin-top: 1em;
        color: #333;
        border: 0;
        font-size: 16px;
        padding: 5px;
    }
    .login-button:hover{
        cursor: pointer;
    }
    .login-button:hover{
        transform: translateY(-3px);
        box-shadow: 0px 3px 0px #6262db;
    }
    .login-button:focus, .login-button:active {
        border: none;
        outline: none;
    }
    .error{
        margin-top: 1em;
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #ff6d6d;
    }
    .error span{
        color: black;
        margin-left: 5px;
    }
</style>

<svelte:head>
	<title>Admin login</title>
</svelte:head>

<section class="login-section" class:invalidCredentials>
    <form on:submit|preventDefault={() => handleLogin(username, password)} class="login-form">
        <label for="login">Логин</label>
        <input disabled={loading} required type="text" bind:this={input1} bind:value={username} id="login" class="login">
        <label for="login">Пароль</label>
        <input disabled={loading} required type="password"  bind:this={input2} bind:value={password} id="password" class="password">
        <button disabled={invalidCredentials || loading} class="login-button button" type="submit">
            {#if !loading}
            Войти
            {:else}
                <BarLoader size="100" color="#d7dada" unit="px"/>
            {/if}
        </button>
        {#if error}
        <div class="error">
            <AlertCircleIcon size="16" /> <span>{error === "Unauthorized" ? "Введенные инициалы неверны" : "Ошибка сервера"}</span>
        </div>
        {/if}
    </form>
</section>
