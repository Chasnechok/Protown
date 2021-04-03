import User from "../../models/user";
import { loginValidation } from "../../validation_types/auth";
import bCrypt from "bcryptjs";
import send from '@polka/send-type';
import jwt from "jsonwebtoken";

export async function post(req, res) {
    const { VISIKOM_API_KEY } = process.env;
    // checking dtoIn
    const {error} = loginValidation(req.body);
    if(error){
        send(res, 400, error);
        return;
    }

    // check if user exists
    const user = await User.findOne({username: req.body.username});
    if(!user) {
        send(res, 401, {error: "Username or password is not valid!", code: "WRONG_CREDENTIALS"});
        return;
    }

    // match the password
    const passwordMatches = await bCrypt.compare(req.body.password, user.password);
    if(!passwordMatches){
        send(res, 401, {error: "Username or password is not valid!", code: "WRONG_CREDENTIALS"});
        return;
    }

    const token = jwt.sign({_id: user._id, agentIdentifier: user.agentIdentifier}, process.env.JWT_SECRET, {expiresIn: "3h"})

    try {
        req.session.token = token;
        req.session.agentIdentifier = user.agentIdentifier;
        send(res, 200, { agentIdentifier: user.agentIdentifier, visikom: VISIKOM_API_KEY })
    } catch (error) {
        send(res, 400, error)
    }
  }
