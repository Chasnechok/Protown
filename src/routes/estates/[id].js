import Estate from "../../models/estate";
import send from '@polka/send-type';

export async function get(req, res) {
	const { id } = req.params;
    try {
        await Estate.findOne({"_id": id}).then(r => send(res, 200, r));
    } catch (error) {
        send(res, 500, error)
    }

}