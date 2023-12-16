const Joi = require("joi");

const postSchema = Joi.object({
    title: Joi.string().required().min(5),
    body: Joi.string().required().min(10),
    tags: Joi.any(),
    publish: Joi.any(),
})

module.exports = { postSchema }