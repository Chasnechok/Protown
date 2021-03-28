import User from "../../models/user";
import send from '@polka/send-type';

export async function get(req, res) {
    const { agentIdentifier } = req.params;
    try {
        await User.findOne({agentIdentifier}, {_id: 0, fullName: 1, mobile: 1})
        .then(r => {return send(res, 200, r)})
    } catch (error) {
        send(res, 500, error)
    }
}