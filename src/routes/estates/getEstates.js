import Estate from "../../models/estate";
import send from '@polka/send-type';

export async function get(req, res) {

    const filters = JSON.parse(req.query.filters);
    //console.log(filters);
    const fee = filters.included.some(el=> el.value === "fee" && el.c) ? false : true;
    //const soonFree = filters.included.some(el => el.value === "soonFree" && el.c) ? true : false;
    filters.included = filters.included.filter(el => el.value !== "soonFree" && el.value !== "fee" && el.c);
    const from = parseInt(req.query.nextKey, 10);
    const to = from + parseInt(req.query.count, 10);
    const nextGroupKey = parseInt(req.query.nextGroupKey, 10);
    try {
        await Estate.find(!filters.isInitial?{
            type: filters.type,
            deal: filters.deal,
            "adress.country": filters.country,
            "adress.city.ru": filters.city,
            price: { $gte: filters.price[0], $lte: filters.price[1] },
            "details.rooms": { $gte: filters.rooms[0], $lte: filters.rooms[1] },
            "details.area.g": { $gte: filters.area[0], $lte: filters.area[1] },
            "extras.fee": fee === false ? false : {$in: [true, false]},
            "extras.included": filters.included[0] ? { $in: filters.included } : { $exists: true }
        }:{
            type: {$exists: true}
        })
        .then(r => {
            //console.log(r);
            send(res, 200,  {
                noMore: r.length <= to,
                estates: r.slice(from, to).map(el => ({groupKey: nextGroupKey, ...el._doc}))
            })})
    } catch (error) {
        send(res, 500, error)
    }
}