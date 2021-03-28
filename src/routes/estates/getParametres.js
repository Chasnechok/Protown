import Estate from "../../models/estate";
import send from '@polka/send-type';

export async function get(req, res) {
    try {
        // костыль start ==> получить максимальное значение цены для каждой валюты
        let maxPricesPerCurrency;
        await Estate.aggregate([
            {
                $group: {
                    _id: "$currency",
                    maxPrice: {$max: "$price"}
                }
            }
        ]).then(r => maxPricesPerCurrency = r);
        await Estate.aggregate([
            {
                $group: {
                    _id: null,
                    currency: {$addToSet: "$currency"},
                    minPrice: {$min: "$price"},
                    maxArea: {$max: "$details.area.g"},
                    minArea: {$min: "$details.area.g"},
                    maxRooms: {$max: "$details.rooms"},
                    minRooms: {$min: "$details.rooms"},
                    countries: {$addToSet: "$adress.country"},
                    cities: {$addToSet: "$adress.city"}
                }
            },
            {
                $project: {
                    _id: 0
                }
            }  
        ])
        .then(r => {
            return send(res, 200, {
                maxUSD: maxPricesPerCurrency.find(el=>el._id==="USD")?.maxPrice,
                maxEUR: maxPricesPerCurrency.find(el=>el._id==="EUR")?.maxPrice,
                maxUAH: maxPricesPerCurrency.find(el=>el._id==="UAH")?.maxPrice,
                ...r[0]})});
    } catch (error) {
        send(res, 500, error)
    }
}