import User from "../../models/user";
import { loginValidation } from "../../validation_types/auth";
import bCrypt from"bcrypt";
import send from '@polka/send-type';
import jwt from "jsonwebtoken";

export async function post(req, res) {

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

    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: "3h"})

    try {
        req.session.token = token;
        req.session.agentIdentifier = user.agentIdentifier;
        send(res, 200, {token: token})
    } catch (error) {
        send(res, 400, error)
    }
  }
