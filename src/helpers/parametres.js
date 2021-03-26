import { writable } from "svelte/store";
import axios from "axios";
const { NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';


const getRates = async () => {
    await axios.get(dev?'http://localhost:3000/getCourses':'https://rich-house.online/getCourses').then(res => changeRates.set(res.data.courses));
}
getRates();

export const currencyOnPage = writable("USD");

export const changeRates = writable(undefined);