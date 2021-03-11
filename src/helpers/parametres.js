import { writable, readable } from "svelte/store";
import axios from "axios";

const getRates = async () => {
    await axios.get('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5').then(res => changeRates.set(res.data))
}
getRates();

export const currencyOnPage = writable("USD");

export const changeRates = writable(undefined);