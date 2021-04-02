<script>
    import {slide} from "svelte/transition";
    export let notification;
    export let notifications;
</script>

<style>
    .notification {
        border-radius: .5em;
        border: 1px solid #6262db;
        position: relative;
        display: flex;
        padding: .5em;
        background-color: white;
        box-shadow: 0 0 6px rgb(0 0 0 / 25%);
    }
    .notification>*:not(:last-child) {
        margin-right: .5em;
    }
    .notification:not(:first-child) {
        margin-top: .5em;
    }
    .notification svg {
        width: 1.5em;
        height: 1.5em;
    }
    a {
        height: 1.5em;
    }
    .notification.error {
        border-color: #f16767;
        color: #f16767;
    }
</style>


<div transition:slide|local class:error={notification.error||notification.code==="VALIDATION_ERROR"} class="notification">
    {#if notification.error||notification.code==="VALIDATION_ERROR"}
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    {:else}
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
    {/if}
    <span>{notification.error||notification.code==="VALIDATION_ERROR"?notification.code:notification.message}</span>
    {#if notification.link}
    <a target="_blank" href={notification.link}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
    </a>
    {/if}
    <svg style="cursor: pointer;" on:click={()=>notifications=notifications.filter(el=>notification.code==="VALIDATION_ERROR"?el.code!==notification.code:el.message!==notification.message)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
</div>