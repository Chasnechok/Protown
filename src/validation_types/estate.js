const Joi = require("@hapi/joi");


export const estateValidation = dtoIn => {
    const v = Joi.object({
        label: Joi.string().required().max(40),
        agent: Joi.alternatives().try("MAR").try("IR").required(),
        realised: Joi.alternatives().try(Joi.date().raw()).try(Joi.boolean()),
        type: Joi.alternatives().try("house").try("land").try("flat").try("commersion").required(),
        price: Joi.number().required(),
        deal: Joi.alternatives().try("buy").try("lease").required(),
        currency: Joi.alternatives().try("UAH").try("USD").try("EUR").required(),
        adress: Joi.object({
            country: Joi.string().required(),
            city: Joi.object({
                ru: Joi.string().max(30),
                ua: Joi.string().max(30),
                en: Joi.string().max(30)
            }).required(),
            district: Joi.string(),
            street: Joi.object({
                ru: Joi.string().max(30),
                ua: Joi.string().max(30),
                en: Joi.string().max(30)
            }),
            number: Joi.number(),
            estateNumber: Joi.number(),
            metro: Joi.object({
                ru: Joi.string(),
                ua: Joi.string(),
                en: Joi.string(),
                distance: Joi.number()
            }),
            zk: Joi.object({
                ru: Joi.string(),
                ua: Joi.string(),
                en: Joi.string()
            })
        }).required(),
        details: Joi.object({
            floor: Joi.number(),
            gfloor: Joi.number(),
            sillings: Joi.number(),
            fond: Joi.boolean(),
            planning: Joi.string(),
            area: Joi.object({
                g: Joi.number(),
                l: Joi.number(),
                k: Joi.number(),
                whole: Joi.number()
            }),
            rooms: Joi.number(),
            state: Joi.boolean(),
            communications: Joi.array()
        }),
        extras: Joi.object(),
        note: Joi.string()

    })
    return v.validate(dtoIn);

}