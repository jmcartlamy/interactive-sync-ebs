const Joi = require('joi');

const inputEventSchema = Joi.object({
    id: Joi.string().min(1).max(64).required(),
    view: Joi.string().max(64).required(),
    values: Joi.object()
        .pattern(Joi.string().min(1).max(64, 'utf8'), [
            Joi.string().allow('').max(128, 'utf8'),
            Joi.array().min(1).max(4),
        ])
        .max(4),
});

module.exports = {
    inputEventSchema: inputEventSchema,
};
