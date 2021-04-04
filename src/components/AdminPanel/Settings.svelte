<script>
    import axios from "axios";
    import { tooltip } from "../../helpers/tooltip";
    import MaskInput from "svelte-input-mask/MaskInput.svelte";
    import { fade } from "svelte/transition";
    import { BarLoader } from 'svelte-loading-spinners';
    import dayjs from "dayjs";
    export let user;
    export let changeRates;
    export let agentIdentifier;
    export let addNotification;
    let newPassword, oldPassword;
    let newMobile = user.mobile;
    let newName = user.fullName;
    let isLoading = false;
    $: canBeSaved = (user.mobile===newMobile&&user.fullName===newName&&!newPassword)?false:(newMobile&&newMobile.length==10&&newName.length>2&&!displayWrongPassword)?true:false;
    $: displayWrongPassword = newPassword?newPassword.length<8?true:false:false;
    const handleMobileChange = ({ detail: {inputState: {unmaskedValue: mobile}} }) => newMobile=mobile;
    const handleUpdateUser = () => {
        isLoading = true;
        const userData = {};
        if(newMobile !== user.mobile) userData.mobile=newMobile;
        if(newName !== user.fullName) userData.fullName=newName;
        if(newPassword&&oldPassword&&!displayWrongPassword) {
            userData.oldPassword = oldPassword;
            userData.password = newPassword;
        }
        axios({
            method: "put",
            url: `/user/${agentIdentifier}`,
            data: userData,
            headers: {
				'content-type': 'application/json'
			}
        })
        .then(res => {
            isLoading = false;
            newPassword = undefined; oldPassword=undefined;
            user.mobile = newMobile; user.fullName = newName;
            addNotification(res.data, 8000)})
        .catch(err => {isLoading = false; console.log(err.response); addNotification(err.response?.data, 8000)})
    }
</script>

<style>
    .settings-wrapper {
        padding: 2em 1em;
    }
    .settings {
        border: 1px solid #e2e2e2;
        box-shadow: inset 0px 0px 6px rgb(0 0 0 / 15%);
        padding: 1em 2em;
        border-radius: .5em;
        max-width: 900px;
        margin: 0 auto;
        position: relative;
    }
    .settings >*:not(:first-child) {
        margin-top: 1em;
    }
    .settings-prop {
    	display: flex;
        flex-wrap: wrap;
    	margin: 0 auto;
    	align-items: baseline;
    	margin-top: 8px;
    	line-height: 19px;
        position: relative;
	}
	.label {
    	color: #5d5d5d;
    	margin-right: 5em;
    	flex: 1;
    	text-align: end;
	}
	.value, :global(.settings-prop input) {
    	flex: 1;
		font-weight: bold;
        display: flex;
        align-items: center;
        letter-spacing: 1px;
        padding: 5px 12px;
	}
    :global(.settings-prop input) {
        border: 1px solid #c0c1c1;
        outline: none;
        padding: 5px 12px;
        color: inherit;
        font-size: 16px;
        border-radius: 6px;
        background-color: #eaeaea;
        box-shadow: inset 0 1px 0 rgb(255 228 232 / 20%);
    }
    :global(.settings-prop input:focus) {
        border-color: #6262db;
        box-shadow: 0 0 0 3px rgb(98 98 219 / 90%);
        background-color: #fff;
    }
    .tooltip:hover {
        cursor: help;
    }
    svg.info {
        pointer-events: none;
        height: 1em;
        width: 1em;
        margin-left: 1em;
    }
    .password-warning {
        position: absolute;
        right: 0;
        bottom: -1.3em;
        color: #f16767;
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
        margin: 2em 0 0 auto !important;
        min-height: 2em;
    }
    button:enabled:hover, button:enabled:focus {
        background-color: #cccccc;
        cursor: pointer;
    }
    .information {
        margin: 2em auto 0 auto;
        max-width: 800px;
    }
    summary:hover {
        cursor: pointer;
    }
    summary {
        text-align: center;
    }
    ul {
        margin-top: 1em;
    }
    @media only screen and (max-width: 560px) {
        .label {
            flex: 1 1 100%;
            text-align: start;
            margin-right: 0;
        }
    }
</style>

<div class="settings-wrapper">
    <form class="settings" on:submit|preventDefault={handleUpdateUser}>
        <div class="settings-prop">
            <span class="label">Идентификатор агента</span>
            <span use:tooltip title="Служит к отображению ваших данных на странице объекта. Не может быть изменён." class="value tooltip">
                {agentIdentifier} 
                <svg class="info" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </span>
        </div>
        <div class="settings-prop">
            <label for="name" class="label">Отображаемое имя</label>
            <input type="text" id="name" class="value" bind:value={newName}>
        </div>
        <div class="settings-prop">
            <label for="name" class="label">Номер телефона</label>
            <MaskInput value={user.mobile} alwaysShowMask maskChar="_" mask="+38 (000) 000-00-00" size={20} on:change={handleMobileChange} />
        </div>
        <div class="settings-prop" style="border-top: 1px dashed rgb(51, 51, 51);padding-top: 1.5em;margin-top: 1.5em;">
            <label for="old-password" class="label">Старый пароль</label>
            <input required={newPassword&&!displayWrongPassword?true:false} type="password" id="old-password" class="value" bind:value={oldPassword}>
        </div>
        <div class="settings-prop">
            <label for="password" class="label">Новый пароль</label>
            <input type="password" id="password" class="value" bind:value={newPassword}>
            {#if displayWrongPassword}
            <span class="password-warning" transition:fade >минимум 8 символов</span>
            {/if}
        </div>
        <button title={(user.mobile===newMobile&&user.fullName===newName&&!newPassword)?"Ничего не изменилось":""} disabled={!canBeSaved||isLoading}>
        {#if isLoading}
        <BarLoader color="#d7dada" />
        {:else}
        Сохранить
        {/if}
        </button>
    </form>
    <div class="information">
        <details>
            <summary>Полезная информация</summary>
            <ul>
                <li><h4>Мин. и макс. значения в фильтрах на главной динамические, зависят от ваших объявлений</h4></li>
                <li><h4>Цена объекта в неосновных валютах зависит от курса валют</h4></li>
                <li><h4>Основная валюта объявления задаётся при его создании</h4></li>
                <li><h4>Заданные пользователем филтры не влияют на секцию лучших предложений</h4></li>
                <li><h4>Объявления отсортированы по дате создания от нового к старому</h4></li>
                <li><h4>Уже сдано: не отображается в топе, прямая ссылка работает</h4></li>
                <li><h4>Уже сдано и дата освобождения не позднее месяца от текущей даты: отображается с предупреждением</h4></li>
                <li><h4>Уже сдано и дата освобождения в прошлом: отображается</h4></li>
                <li><h4>Скрытое: не отображается на сайте, прямая ссылка для обычных пользователей не работает</h4></li>
                <li>
                    <div class="information" style="margin-left: 1em;">
                        <details>
                            <summary>Курсы валют</summary>
                            <ul>
                                <li><h4>Обновляются каждые 6 часов</h4></li>
                                <li><h4>Последнее успешной обновление: {dayjs(changeRates.timestamp).format("DD/MM/YYYY [в] HH:mm")}</h4></li>
                                <li><h4>USD покупка: {changeRates.courses[0].buy}</h4></li>
                                <li><h4>USD продажа: {changeRates.courses[0].sale}</h4></li>
                                <li><h4>EUR покупка: {changeRates.courses[1].buy}</h4></li>
                                <li><h4>EUR продажа: {changeRates.courses[1].sale}</h4></li>
                            </ul>
                        </details>
                    </div>
                </li>
            </ul>
        </details>
    </div>
</div>