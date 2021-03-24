import Course from "../models/course";
import send from '@polka/send-type';
import axios from "axios";

setInterval(async ()=>{
    try {
        const actualCourses = await axios.get('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5');
        await Course.findOneAndUpdate({_id: {$exists: true}}, {courses: actualCourses.data.filter(el=>el.ccy==="EUR"||el.ccy==="USD"), timestamp: Date.now()}, {upsert: true} )
    } catch (error) {
        console.log(error)
    }
}, 6*60*60*100);

export async function get(req, res) {
    try {
        await Course.aggregate([
            {
             $match: {courses: {$exists: true}}
            },
            {
             $project: {
                courses: 1, timestamp: 1, _id: 0
             }
            }
        ]).then(r => send(res, 200, r[0]??undefined));
    } catch (error) {
        send(res, 500, error)
    }
}