import Estate from "../../models/estate";
import Course from "../../models/course";
import send from '@polka/send-type';
import { currencyCalculator } from "../../helpers/converter"; 

export async function get(req, res) {

    const filters = JSON.parse(req.query.filters);
    const { courses: changeRates } = filters.isInitial?{changeRates: null}:await Course.findOne();
    const fee = filters.included.some(el=> el.value === "fee" && el.c) ? false : true;
    //const soonFree = filters.included.some(el => el.value === "soonFree" && el.c) ? true : false;
    filters.included = filters.included.filter(el => el.value !== "soonFree" && el.value !== "fee" && el.c);
    const from = parseInt(req.query.nextKey, 10);
    const to = from + parseInt(req.query.count, 10);
    try {
        await Estate.find(!filters.isInitial?{
            type: filters.type,
            deal: filters.deal,
            "adress.country": filters.country,
            "adress.city.ru": filters.city,
            "details.rooms": { $gte: filters.rooms[0], $lte: filters.rooms[1] },
            "details.area.g": { $gte: filters.area[0], $lte: filters.area[1] },
            "extras.fee": fee === false ? false : {$in: [true, false]},
            "extras.included": filters.included[0] ? { $in: filters.included } : { $exists: true }
        }:{
            type: {$exists: true}
        })
        .then(r => {
            const foundEstates = filters.isInitial?r:r.filter(el=> {const a = currencyCalculator(el.price, filters.currency, el.currency, changeRates);return a>=filters.price[0]&&a<=filters.price[1];});
            const foundEstatesSliced = foundEstates.slice(from, to);
            send(res, 200, {
                noMore: foundEstates.length <= to,
                estates: foundEstatesSliced
            })})
    } catch (error) {
        send(res, 500, error)
    }
}