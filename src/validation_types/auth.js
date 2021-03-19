const Joi = require("@hapi/joi");


export const registerValidation = dtoIn => {
    const v = Joi.object({
        agentIdentifier: Joi.string().required(),
        username: Joi.string().min(3).required(),
        password: Joi.string().min(12).required(),
        photoLink: Joi.string(),
        mobile: Joi.string(),
        fullName: Joi.string()
    })
    return v.validate(dtoIn);

}

export const loginValidation = dtoIn => {
    const v = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    })
    return v.validate(dtoIn);

}
