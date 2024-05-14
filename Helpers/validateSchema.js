const Joi = require('joi');

const authSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string ().min(8).required(),
})

const vendorValidate = Joi.object({
    name: Joi.string().required(),
    quantity: Joi.string().required() ,
    price_Ksh: Joi.string().required(),
})
module.exports = {
    authSchema,
    vendorValidate
}