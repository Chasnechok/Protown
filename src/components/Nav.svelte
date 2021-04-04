<script>
	import Select from 'svelte-select';
	import { slide } from 'svelte/transition';
	import { currencyOnPage } from "../helpers/parametres";
	let y;
	let prevY = 0;
	let fixed = false; let opened = false;
	$: if(y){
		fixed = y > prevY ? true : false;
		prevY = y;
	}
	const currencies = [{label: "Гривна", value: "UAH"}, {label: "Доллар", value: "USD"}, {label: "Евро", value: "EUR"}];
</script>

<style>
	
	nav.fixed {
		--desctop-padding: .2em 0;
		--mobile-padding: .2em 2em;
	}

	nav {
		--desctop-padding: 1em 0;
		--mobile-padding: 1em 2em;
		max-width: 1650px;
		padding: var(--desctop-padding);
		display: flex;
		margin: 0 auto;
		transition: .5s;
		position: relative;
	}
	

	a {
		text-decoration: none;
		transition: .5s;
	}
	a:not(.logo-link):hover {
		color:#4a40d4;
		letter-spacing: 1px;
	}

	.nav-opener, .navigation-mini {
		display: none;
	}

	.logo, .navigation {
		display: flex;
		align-items: center;
	}

	.logo {
		flex: 1 1 30%;
		font-weight: 800;
		font-size: 24px;
		text-transform: uppercase;
		justify-content: center;
		position: relative;
		
	}

	.navigation {
		flex: 1 1 70%;
		justify-content: space-between;
		padding: 0 2em 0 7em;
	}

	.nav-opener:hover, .selector:hover{
		cursor: pointer;
	}
	.selector {
		display: flex;
		align-items: center;
		--border: none;
        --itemIsActiveBG: rgb(98, 98, 219, 0.9);
        --itemHoverBG: rgb(98, 98, 219, 0.1);
        --padding: 0 8px 0 0;
        --multiItemPadding: 0 7px 0 7px;
        --multiItemBG: none;
        --multiItemActiveBG: rgb(98, 98, 219, 0.9);
        --multiClearHoverFill: rgb(98, 98, 219, 0.9);
        --inputFontSize: 16px;
        --multiSelectPadding: 0 0 0 16px;
	}
	.selector {
		min-width: 120px;
	}

	@media only screen and (max-width: 1024px) {
		.navigation {
			padding: 0 2em 0 2em;
		}
	}
	@media only screen and (max-width: 750px) {
		nav {
			padding: var(--mobile-padding);
			justify-content: space-between;
		}
		.logo {
			flex: none;
		}
		.nav-opener{
			display: flex;
			align-items: center;
		}
		.navigation {
			display: none;
		}
		svg {
			height: 2em;
		}
		.opened {
			display: flex;
			align-items: center;
			flex-direction: column;
		}
		.opened > * {
			padding: 1em 0;
		}
    }



</style>
<svelte:window bind:scrollY={y}/>
<nav class:fixed>
	<div class="logo">
		<a class="logo-link" style="z-index: 2;" href=".">Rich-House</a>
	</div>
	<div class="navigation">
		<a rel=prefetch  href="/">Этапы покупки</a>
		<a rel=prefetch  href="/">О нас</a>
		<a rel=prefetch  href="/">Напишите нам</a>
		<div class="selector">
			<span>{$currencyOnPage==="USD"?"$":$currencyOnPage==="EUR"?"€":"₴"}</span>
			<Select on:select={({detail})=>{$currencyOnPage = detail.value}} items={currencies} isClearable={false} isSearchable={false} selectedValue={currencies.find(v=>v.value===$currencyOnPage)} />
		</div>
	</div>
	<div class="nav-opener" on:click={()=>opened = !opened}>
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={!opened ? "M4 6h16M4 12h16M4 18h16" : "M6 18L18 6M6 6l12 12"} />
		</svg>
	</div>
</nav>

{#if opened}
	<div class="navigation-mini" class:opened>
		{#each [0,1,2,3] as a}
			{#if a === 0}
			<a rel=prefetch transition:slide href="/">Этапы покупки</a>
			{:else if a === 1}
			<a rel=prefetch transition:slide href="/">О нас</a>
			{:else if a === 2}
			<a rel=prefetch transition:slide href="/">Напишите нам</a>
			{:else}
			<div class="selector" transition:slide>
				<!-- <span>Русский</span>
				<span>|</span> -->
				<Select on:select={({detail})=>{$currencyOnPage = detail.value}} items={currencies} isClearable={false} isSearchable={false} selectedValue={currencies.find(v=>v.value===$currencyOnPage)} />
			</div>
			{/if}
		{/each}
	</div>
{/if}
