import Estate from "../../models/estate";
import send from '@polka/send-type';
import dayjs from "dayjs";

export async function get(req, res) {
    let date = dayjs().add(1, 'M');
    date = date.toISOString();
    try {
        const allCount = await Estate.countDocuments({isHidden: false});
        await Estate.find({"extras.top": true, isHidden: false, $or: [
            {"realised": false},
            {"realised": {$lt: new Date(date)}}
        ]}, {note: 0, createdAt: 0, isHidden: 0}).then(r => send(res, 200, {allCount, items: r}));
    } catch (error) {
        send(res, 500, error)
    }
}