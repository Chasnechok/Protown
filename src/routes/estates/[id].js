import Estate from "../../models/estate";
import send from '@polka/send-type';

export async function get(req, res) {
	const { id } = req.params;
    //console.log(req.session);
    try {
        await Estate.findOne({"_id": id}, {note: !req.session&&0}).then(r => send(res, 200, r));
    } catch (error) {
        send(res, 500, error)
    }

}