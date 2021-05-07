<script context="module">
	export async function preload() {
		const resMarina = await this.fetch("/user/MAR")
		const marina = await resMarina.json();
        const resIrina = await this.fetch("/user/IRA")
		const irina = await resIrina.json();
		return { marina, irina };
	}
</script>


<script>
    import { form as validator } from 'svelte-forms';
    import MaskInput from "svelte-input-mask/MaskInput.svelte";
    import striptags from "striptags";
    import { slide } from "svelte/transition";
    import { BarLoader } from 'svelte-loading-spinners';
    import { formatPhoneNumber } from "../helpers/converter";
    import Notification from "../components/AdminPanel/Notification.svelte";
    import axios from 'axios';
    import { onMount, afterUpdate } from 'svelte';

    export let irina;
    export let marina;
    let sender, senderName, senderMobile, message, loading = false;
    let notifications = [];
    let myForm;
    onMount(() => {
    myForm = validator(() => ({
        senderName: { value: senderName, validators: ['required', 'min: 2'] },
        sender: { value: sender, validators: ['email'] }
    }),
    {
      validateOnChange: false
    }
    );
    });

    afterUpdate(() => {
        myForm.validate();
    });
    const handleSendMessage = () => {
        loading = true;
        handleClearTags();
        axios.post("/email/send", {
            sender,
            senderName,
            senderMobile,
            message
        })
        .then(res => {
            sender=undefined;senderMobile=undefined;senderName=undefined;message=undefined;
            loading = false;
            addNotification(res.data, 4000);
        })
        .catch(err => {
            loading = false;
            console.log(err.response);
            addNotification(err.response?.data, 4000);
        })
    }
    const handleClearTags = () => {
        if(message) message = striptags(message);
    }
    const handleMobileChange = ({ detail: {inputState: {unmaskedValue: mobile}} }) => senderMobile=mobile;
    $: warningMessage = getWarningMessage(sender, senderMobile, $myForm);
    const getWarningMessage = () => {
        if(!senderName||!myForm) return "Введите имя";
        if(!$myForm.fields.sender.valid&&sender) return "E-mail адресс введен некорректно";
        if(senderMobile&&senderMobile.length<10) return "Телефон введён некорректно";
        if(!sender&&!senderMobile) return "Укажите хотя бы 1 контакт";
        if(!message) return "Введите сообщение";
        return undefined;
    }
    const addNotification = (notification, duration) => {
        if(!notification||(!notification.message&&!notification.code)) return;
        notifications = [notification, ...notifications];
        if(duration) {
            setTimeout(()=>notifications=notifications.filter(el=>el.message!==notification.message), duration)
        }
    }
</script>

<style>
    
    h2 {
        text-align: center;
    }
    form {
        margin: 0 auto;
        max-width: 850px;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        position: relative;
        padding: 1em 2em 2em;
        border-radius: .5em;
        box-shadow: inset 0 0 6px rgb(0 0 0 / 15%);
        border: 1px solid #e2e2e2;
    }
    form > * {
        margin: 0 .5em;
    }

    .prop-vertical {
        display: flex;
        flex-direction: column;
        margin-top: 1em;
        flex: 1;
        position: relative;
        max-width: 100%;
    }
    :global(.prop-vertical.invalid input) {
        border-color: #f16767;
        box-shadow: 0 0 0 2px #f16767;
    }
    :global(.prop-vertical input), textarea {
        font-weight: bold;
        transition: .3s;
        letter-spacing: 1px;
        border: 1px solid #c0c1c1;
        outline: none;
        padding: 5px 12px;
        color: inherit;
        font-size: 16px;
        border-radius: 6px;
        background-color: #eaeaea;
        box-shadow: inset 0 1px 0 rgb(255 228 232 / 20%);
    }
    :global(.prop-vertical input:focus), textarea:focus {
        border-color: #6262db;
        box-shadow: 0 0 0 3px rgb(98 98 219 / 90%);
        background-color: #fff;
    }
    .controls, textarea {
        flex: 1 1 100%;
        max-width: 100%;
    }
    button {
        display: block;
        padding: 5px 12px;
        border: 1px solid #c0c1c1;
        outline: none;
        padding: 5px 12px;
        color: inherit;
        font-size: 16px;
        border-radius: 6px;
        background-color: #eaeaea;
        box-shadow: inset 0 1px 0 rgb(255 228 232 / 20%);
        min-height: 2em;
        margin: 1em 0 0 auto;
        min-width: 226px;
    }
    button:enabled:hover, button:enabled:focus {
        background-color: #cccccc;
        cursor: pointer;
    }
    .warning {
        box-shadow: 0 -2px #f16767;
        display: block;
        color: #f16767;
        font-size: 14px;
        text-align: end;
    }
    .messengers-section-wrapper {
        position: relative;
    }
    .messengers-section-wrapper::before {
		content: "";
    	display: block;
    	position: absolute;
    	width: 200vw;
    	left: -100vw;
    	top: 50%;
    	transform: translateY(-50%);
    	height: 100%;
    	z-index: 0;
    	background-color: #efefef;
	}
    .messengers-section {
        padding: 1em 1em 2em;
        margin: 0 auto;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        position: relative;
    }
    .rielor-card {
        margin: 1em 1em 0;
        padding: 1em;
        background-color: #fff;
        border-radius: .3em;
        box-shadow: 0px 0px 6px rgb(0 0 0 / 25%);
        display: flex;
        flex-wrap: wrap;
        position: relative;
        width: 485px;
        justify-content: center;
        transition: .3s;
    }
    .rielor-card:hover {
        transform: scale(1.1);
        box-shadow: 0px 0px 12px rgb(0 0 0 / 55%);
    }
    .photo-wrapper {
        height: 150px;
        width: 160px;
    }
    img {
        object-fit: cover;
        max-height: 100%;
        margin: auto;
        display: block;
        border-radius: .5em;
    }
    fieldset {
        border: none;
        border-top: 1px solid #333;
        margin-left: 1em;
        padding: 0 1em;
    }
    legend {
        padding: .5em;
        margin: 0 auto;
    }
    .contact-wrapper {
        display: flex;
        flex-wrap: wrap;
        position: relative;
        margin-top: .2em;
    }
    
    .icon {
        width: 20px;
        height: 20px;
        background-repeat: no-repeat;
        background-size: cover;
        margin-right: 0.5em;
    }
    .notifications-wrapper {
	    position: fixed !important;
	    left: 50%;
	    top: 6.5em;
	    transform: translateX(-50%);
	    z-index: 999;
    }
    @media only screen and (max-width: 850px) {
        form {
            border-radius: 0;
        }
    }
    @media only screen and (max-width: 520px) {
        .rielor-card {
            width: unset;
            margin: 2em 0 0;
        }
        button {
            margin: 1em auto 0 0;
        }
        .warning {
            text-align: start;
        }
        fieldset {
            margin-left: 0;
        }
    }

</style>
<svelte:head>
    <title>ProTown | Контакты</title>
</svelte:head>
<section>
    <div class="notifications-wrapper">
        {#each notifications as notification}
            <Notification bind:notifications {notification} />
        {/each}
    </div>
    <h2>Мы в мессенджерах</h2>
    <div class="messengers-section-wrapper">
        <div class="messengers-section">
            <div class="rielor-card">
                <div class="photo-wrapper">
                    <img on:contextmenu|preventDefault src="https://assets.protown.in.ua/avatars/ira.jpg" alt="Irina">
                </div>
                <fieldset>
                    <legend>{irina.fullName}</legend>
                    {#each ["telegram", "viber", "whatsapp", "mail"] as contact, i}
                    <div class="contact-wrapper">
                        <div class="icon" style="background-image: url(/{contact}.svg)" />
                        <span>{i!==3?formatPhoneNumber(irina.mobile):"irina@protown.in.ua"}</span>
                    </div>
                    {/each}
                </fieldset>
            </div>
            <div class="rielor-card">
                <div class="photo-wrapper">
                    <img on:contextmenu|preventDefault src="https://assets.protown.in.ua/avatars/mar.jpg" alt="Marina">
                </div>
                <fieldset>
                    <legend>{marina.fullName}</legend>
                    {#each ["telegram", "viber", "whatsapp", "mail"] as contact, i}
                    <div class="contact-wrapper">
                        <div class="icon" style="background-image: url(/{contact}.svg)" />
                        <span>{i!==3?formatPhoneNumber(marina.mobile):"marina@protown.in.ua"}</span>
                    </div>
                    {/each}
                </fieldset>
            </div>
        </div>
    </div>
    <h2 style="margin-top: 1em;">Напишите нам</h2>
    <form on:submit|preventDefault={handleSendMessage}>
        <div class="prop-vertical">
            <label for="senderName">Вашe имя</label>
            <input required bind:value={senderName} type="text" id="senderName">
        </div>
        <div class="prop-vertical" class:invalid={!myForm||(!$myForm.fields.sender.valid&&sender)}>
            <label for="sender">Ваш e-mail</label>
            <input bind:value={sender} type="text" id="sender">
        </div>
        <div class="prop-vertical" class:invalid={senderMobile&&senderMobile.length<10}>
            <label for="sender-mobile">Контактный телефон</label>
            <MaskInput value={senderMobile} alwaysShowMask maskChar="_" mask="+38 (000) 000-00-00" on:change={handleMobileChange} />
        </div>
        <div class="prop-vertical">
            <label for="areaMessage">Ваше сообщение</label>
            <textarea required on:focusout={handleClearTags} bind:value={message} name="areaMessage" id="areaMessage" cols="30" rows="10"></textarea>
        </div>
        <div class="controls" style="margin-top: 1em;">
            {#if warningMessage}
            <span transition:slide class="warning">{warningMessage}</span>
            {/if}
            <button disabled={!myForm||loading||(!sender&&!senderMobile)||(sender&&!$myForm.fields.sender.valid)||(senderMobile&&senderMobile.length<10)} type="submit">
            {#if !loading}
            Отправить
            {:else}
            <BarLoader size="100" color="#d7dada" unit="px"/>
            {/if}
            </button>
        </div>
    </form>
</section>