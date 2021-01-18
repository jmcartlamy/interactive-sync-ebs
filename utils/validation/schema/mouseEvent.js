const Joi = require('joi');

const schemaMouseEvent = Joi.object({
    type: Joi.string().min(1).max(64).required(),
    clientWidth: Joi.number().integer().min(1).max(7680).required(),
    clientHeight: Joi.number().integer().min(1).max(7680).required(),
    clientX: Joi.number().integer().min(1).max(7680).required(),
    clientY: Joi.number().integer().min(1).max(7680).required(),
}).required();

module.exports = {
    schemaMouseEvent: schemaMouseEvent,
};
