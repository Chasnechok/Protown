import Estate from "../../models/estate";
import Course from "../../models/course";
import send from '@polka/send-type';
import { currencyCalculator } from "../../helpers/converter"; 
import dayjs from "dayjs";

export async function get(req, res) {

    const token = req.session?.token;
    const filters = JSON.parse(req.query.filters);
    const { courses: changeRates } = filters.isInitial?{changeRates: null}:await Course.findOne();
    const fee = filters.included&&filters.included.some(el=> el.value === "fee" && el.c) ? false : true;
    const soonFree = filters.included&&filters.included.some(el => el.value === "soonFree" && el.c) ? true : false;
    if(filters.included)filters.included = filters.included.filter(el => el.value !== "soonFree" && el.value !== "fee" && el.c).map(el=>el.value);
    const from = parseInt(req.query.nextKey, 10);
    const to = from + parseInt(req.query.count, 10);
    let date = soonFree||filters.isInitial?dayjs().add(1, 'M'):dayjs();
    date = date.toISOString();
    try {
        await Estate.find(!filters.isInitial?{
            type: filters.type,
            deal: filters.deal,
            "adress.country": filters.country,
            "adress.city.ru": filters.city.replace("+", " "),
            $or: [
                {"details.rooms": { $gte: filters.rooms[0], $lte: filters.rooms[1] }},
                {"details.rooms": { $exists: false }}
            ],
            $or: [
                {"details.area.g": { $gte: filters.area[0], $lte: filters.area[1] }},
                {"details.area.g": { $exists: false }}
            ],
            "extras.fee": fee === false ? false : {$in: [true, false]},
            "extras.included": filters.included[0] ? { $in: filters.included } : { $exists: true },
            isHidden: token&&filters.displayHidden?{$in: [true, false]}:false,
            $or: [
                {"realised": filters.displayHidden||!soonFree?{$exists: true}:false},
                {"realised": soonFree?{$lt: new Date(date)}:{$exists: true}}
            ]
        }:{
            type: {$exists: true},
            isHidden: token&&filters.displayHidden?{$in: [true, false]}:false,
            $or: [
                {"realised": filters.displayHidden||!soonFree?{$exists: true}:false},
                {"realised": soonFree?{$lt: new Date(date)}:{$exists: true}}
            ]
        }, !token&&{note: 0, isHidden: 0, createdAt: 0})
        .sort({createdAt: -1})
        .then(r => {
            const foundEstates = filters.isInitial?r:r.filter(el=> {const a = currencyCalculator(el.price, filters.currency, el.currency, changeRates);return a>=0&&a<=filters.maxPrice[0];});
            const foundEstatesSliced = foundEstates.slice(from, to);
            send(res, 200, {
                noMore: foundEstates.length <= to,
                estates: foundEstatesSliced,
                length: foundEstates.length
            })})
    } catch (error) {
        console.log(error)
        send(res, 500, error)
    }
}