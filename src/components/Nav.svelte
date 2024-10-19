<script>
  import Select from 'svelte-select'
  import { currencyOnPage, SUPPORTED_CURRENCIES } from '../helpers/parametres'
  let y
  let prevY = 0
  let fixed = false
  $: if (y) {
    fixed = y > prevY ? true : false
    prevY = y
  }
  const currencies = [
    { label: '₴ UAH', value: SUPPORTED_CURRENCIES.UAH },
    { label: '$ USD', value: SUPPORTED_CURRENCIES.USD },
    { label: '€ EUR', value: SUPPORTED_CURRENCIES.EUR },
  ]
</script>

<svelte:window bind:scrollY={y} />
<nav class:fixed>
  <div class="logo">
    <a class="logo-link" style="z-index: 2;" href=".">Protown</a>
  </div>
  <div class="navigation">
    <div class="selector">
      <Select
        on:select={({ detail }) => {
          $currencyOnPage = detail.value
        }}
        items={currencies}
        isClearable={false}
        isSearchable={false}
        selectedValue={currencies.find((v) => v.value === $currencyOnPage)}
        inputStyles="cursor: pointer;"
      />
    </div>
  </div>
</nav>

<style>
  nav.fixed {
    --desctop-padding: 0.2em 0;
    --mobile-padding: 0.2em 2em;
  }

  nav {
    --desctop-padding: 1em 0;
    --mobile-padding: 0em 2em;
    max-width: 1650px;
    padding: var(--desctop-padding);
    display: flex;
    margin: 0 6em;
    justify-content: space-between;
    transition: 0.3s;
    position: relative;
  }

  a {
    text-decoration: none;
    transition: 0.5s;
  }
  a:not(.logo-link):hover {
    color: #4a40d4;
    letter-spacing: 1px;
  }

  .logo,
  .navigation {
    display: flex;
    align-items: center;
  }

  .logo {
    font-weight: 800;
    font-size: 24px;
    text-transform: uppercase;
    justify-content: center;
    position: relative;
  }

  .selector:hover {
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

  @media only screen and (max-width: 1024px) {
    nav {
      margin: 0 3em;
    }
  }
  @media only screen and (max-width: 750px) {
    nav {
      padding: var(--mobile-padding);
      justify-content: space-between;
      margin: 0 auto;
    }
    .logo {
      flex: none;
    }
  }
</style>
