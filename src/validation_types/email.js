const Joi = require("@hapi/joi");

export const emailValidation = dtoIn => {
    const v = Joi.object({
        sender: Joi.string().email({ tlds: { allow: false } }),
        senderName: Joi.string().min(3).required(),
        senderMobile: Joi.string(),
        message: Joi.string().required()
    })
    return v.validate(dtoIn);
}
