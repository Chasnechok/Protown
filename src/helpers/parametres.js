import { writable } from 'svelte/store'

export const SUPPORTED_CURRENCIES = {
  USD: 'USD',
  UAH: 'UAH',
  EUR: 'EUR',
}

export const currencyOnPage = writable(SUPPORTED_CURRENCIES.USD)
export const languageOnPage = writable('UAH')
