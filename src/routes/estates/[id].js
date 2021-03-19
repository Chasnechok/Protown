import Estate from "../../models/estate";
import send from '@polka/send-type';

export async function get(req, res) {
	const { id } = req.params;
    try {
        await Estate.find({"_id": id}).then(r => send(res, 200, r[0]? r[0] : null));
    } catch (error) {
        send(res, 500, error)
    }

}