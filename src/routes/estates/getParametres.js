import Estate from "../../models/estate";
import send from '@polka/send-type';
import dayjs from "dayjs";


export async function get(req, res) {
    let date = dayjs().add(1, 'M');
    date = date.toISOString();
    try {
        // костыль start ==> получить максимальное значение цены для каждой валюты в рамках одного типа предложения (lease, buy)
        const maxPricesPerCurrencyAndDeal = {buy: {},lease: {}}
        await Estate.aggregate([
            {
                $match: {
                    isHidden: false
                }
            },
            {
                $group: {
                    _id: {deal: "$deal", currency: "$currency"},
                    maxPrice: {$max: "$price"}
                }
            },
            {
                $project: {
                    maxPrice: 1, deal: "$_id.deal", currency: "$_id.currency", _id: 0
                }
            }
        ]).then(r=>r.forEach(el => maxPricesPerCurrencyAndDeal[el.deal][el.currency] = el.maxPrice)).catch(console.log);
        
        await Estate.aggregate([
            {
                $match: {
                    isHidden: false,
                    $or: [
                        {"realised": false},
                        {"realised": {$lt: new Date(date)}}
                    ]
                }
            },
            {
                $group: {
                    _id: null,
                    deals: {$addToSet: "$deal"},
                    currency: {$addToSet: "$currency"},
                    minPrice: {$min: "$price"},
                    maxArea: {$max: "$details.area.g"},
                    minArea: {$min: "$details.area.g"},
                    maxAreaSotki: {$max: "$details.area.whole"},
                    minAreaSotki: {$min: "$details.area.whole"},
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
        .then(r => { return send(res, 200, {maxPricesPerCurrencyAndDeal, ...r[0]} )})
    } 
    catch (error) {
        send(res, 500, error)
    }
}