import User from "../../models/user";
import { registerValidation } from "../../validation_types/auth";
const bCrypt = require("bcryptjs");
const send = require('@polka/send-type');

export async function post(req, res) {

    // checking dtoIn
    const {error} = registerValidation(req.body);
    if(error){
     error.code = "VALIDATION_ERROR"
     send(res, 400, error);
     return;
    }

    const userPhoto = req.files;
    console.log(userPhoto);
    return;
   
    // check if user exists
    if(await User.findOne({username: req.body.username})) {
        send(res, 400, {error: `Username ${req.body.username} already exists.`, code: "USER_EXISTS"});
        return;
    }

    // hash the password
    const s = await bCrypt.genSalt(12);
    const hashedPassword = await bCrypt.hash(req.body.password, s);

    // create a user
    const user = new User({
        agentIdentifier: req.body.agentIdentifier,
        username: req.body.username,
        password: hashedPassword
    });

    

    try {
        await user.save();
        send(res, 200, {id: user._id, username: user.username});
    } catch (error) {
        error.code = "DATABASE_ERROR";
        send(res, 400, error);
    }
  }