import Estate from "../../models/estate";
import send from '@polka/send-type';

export async function get(req, res) {
	const { id } = req.params;
    //console.log("session: ", req.session);
    const token = req.session?.token;
    // I'm not making token verification because req.session is only available if user has a valid signed cookie.
    
    try {
        await Estate.findOne({"_id": id}, !token&&{note: 0}).then(r => send(res, 200, r));
    } catch (error) {
        send(res, 500, error)
    }

}