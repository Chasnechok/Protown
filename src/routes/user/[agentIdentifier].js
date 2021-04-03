import User from "../../models/user";
import send from '@polka/send-type';
import bCrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function get(req, res) {
    const { agentIdentifier } = req.params;
    try {
        await User.findOne({agentIdentifier}, {_id: 0, fullName: 1, mobile: 1})
        .then(r => {return send(res, 200, r)})
    } catch (error) {
        send(res, 500, error)
    }
}

export async function put(req, res) {
    if(!req.session||!req.session.token) return send(res, 401, {error: true, message: "Access denied!", code: "NO_ACCESS"});
    const { agentIdentifier } = req.params;
    const { token } = req.session;

    // check if user modifies his record
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded.agentIdentifier||decoded.agentIdentifier!==agentIdentifier) return send(res, 401, {error: true, message: "Access denied!", code: "NO_ACCESS"});
    } catch (error) {
        return send(res, 401, {error: true, message: "Access denied!", code: "NO_ACCESS"});
    }

    // check if user exists
    const user = await User.findOne({agentIdentifier});
    if(!user) return send(res, 401, {error: true, message: `User with ${agentIdentifier} identifier doesn't exist!`, code: "USER_NOT_FOUND"});

    // check if passwords match, then hash new password
    if(req.body.password&&req.body.oldPassword) {
        const passwordMatches = await bCrypt.compare(req.body.oldPassword, user.password);
        if(!passwordMatches) return send(res, 401, {error: true, message: "Passwords don't match", code: "Пароли не совпадают"});
        const s = await bCrypt.genSalt(12);
        const hashedPassword = await bCrypt.hash(req.body.password, s);
        delete req.body.oldPassword; req.body.password=hashedPassword;
    }
    // finaly update user's info
    try {
        for(let key in req.body) user[key] = req.body[key];
        await user.save();
        return send(res, 200, {message: "Настройки обновлены"})
    } catch (error) {
        return send(res, 500, {error: true, message: error, code: "SERVER_ERROR"})
    }
}