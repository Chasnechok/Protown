import { writable, derived } from 'svelte/store';
const initialFilters = {
    type: "flat",
    deal: "lease",
    country: "UA",
    city: "Киев",
    price: [0, 999999999999],
    currency: "USD",
    districts: [],
    rooms: [1, 999999999999],
    area: [0, 999999999999],
    included: [],
    isInitial: true
}

function createFilters() {
	const { subscribe, set } = writable({...initialFilters});
	return {
		subscribe,
        set: (value) => set(value),
		reset: (districtSelector) => (districtSelector && districtSelector.handleClear(), set({...initialFilters}))
    }
}


export const filters = createFilters();
export const extras = derived(
	filters,
	$filters => ["house", "flat", "commersion"].includes($filters.type) && $filters.deal === "buy" ? [{label: "Без комиссии", c: false, value: "fee"}, {label: "С мебелью", c: false, value: "fur"}] :
    ["house", "flat", "commersion"].includes($filters.type) && $filters.deal === "lease" ? [{label: "Без комиссии", c: false, value: "fee"}, {label: "С мебелью", c: false, value: "fur"}, {label: "Скоро освобождается", c: false, value: "soonFree"}] : 
    [{label: "Без комиссии", c: false, value: "fee"}]
);
export const items = writable([]);
export const noMore = writable(false);
export const districtSelector = writable(undefined);