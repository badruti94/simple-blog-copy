const Joi = require("joi");

const registerSchema = Joi.object({
    username: Joi.string().required().min(5),
    email: Joi.string().required().email(),
    name: Joi.string().required(),
    address: Joi.string().required().min(5),
    password: Joi.string().required().min(8),
})

const loginSchema = Joi.object({
    username: Joi.string().required().min(5),
    password: Joi.string().required().min(8),
})

module.exports = { registerSchema, loginSchema }