import Estate from "../../models/estate";
import send from '@polka/send-type';

export async function get(req, res) {
    try {
        await Estate.find({"extras.top": true}).then(r => send(res, 200, r));
    } catch (error) {
        send(res, 500, error)
    }
}