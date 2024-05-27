const Joi = require('joi');

// Registration schema
const registerSchema = Joi.object({
    username: Joi.string().min(4).max(30).required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(6).required(),
})

// Login schema
const loginSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(6).required(),
})

const vendorValidate = Joi.object({
    name: Joi.string().required(),
    quantity: Joi.string().required() ,
    price_Ksh: Joi.string().required(),
})
module.exports = {
    registerSchema,
    loginSchema,
    vendorValidate
}