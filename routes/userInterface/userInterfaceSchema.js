const Joi = require('joi');

const REGEX_ID_SPECIFICATION_HTML4 = /^[A-Za-z]+[\w\-\:\.]*$/;

const schemaExtensionComponent = Joi.object({
    type: Joi.string().valid('title', 'input').required(),
    name: Joi.string()
        .pattern(REGEX_ID_SPECIFICATION_HTML4)
        .min(3)
        .max(64)
        .when('type', { is: 'input', then: Joi.required() }),
    label: Joi.string().allow('').max(96),
    placeholder: Joi.string().allow('').max(32),
});

const schemaComponent = Joi.object({
    type: Joi.string().valid('title', 'button').required(),
    name: Joi.string()
        .pattern(REGEX_ID_SPECIFICATION_HTML4)
        .min(3)
        .max(64)
        .when('type', { is: 'button', then: Joi.required() }),
    label: Joi.string().allow('').max(96).default('A label'),
    keyCode: Joi.string().alphanum().max(64),
    cooldown: Joi.object({
        duration: Joi.number().min(3000).max(60000).default(10000),
        broadcast: Joi.boolean().truthy(1).falsy(0).default(true),
    }).default({ duration: 10000, broadcast: true }),
    extension: Joi.object({
        title: Joi.string().min(2).max(96),
        submit: Joi.object({
            label: Joi.string().allow('').max(64).default('Submit'),
        }).default({ label: 'Submit' }),
        components: Joi.array().items(schemaExtensionComponent).min(1).max(3).unique('name'),
    }),
});

const schemaObjectComponent = Joi.object({
    components: Joi.array().items(schemaComponent).min(1).max(4).unique('name'),
});

const userInterfaceSchema = Joi.object({
    id: Joi.string().alphanum().max(64).required(),
    mobile: Joi.object({
        title: Joi.string().min(2).max(96),
        components: Joi.array().items(schemaComponent).min(1).max(4).unique('name'),
    }),
    panel: schemaObjectComponent,
    video_overlay: Joi.object({
        mouse: Joi.array()
            .items(
                Joi.object({
                    type: Joi.string().valid('mousedown', 'mouseup').required(),
                    cooldown: Joi.object({
                        duration: Joi.number().min(1000).max(60000).default(3000),
                        limit: Joi.number().min(1).max(10).default(2),
                    }).default({ duration: 3000, limit: 2 }),
                })
            )
            .min(1)
            .max(2)
            .unique('type'),
        left: schemaObjectComponent,
        bottom: schemaObjectComponent,
        right: schemaObjectComponent,
        top: schemaObjectComponent,
    }),
}).empty({});

module.exports = {
    userInterfaceSchema: userInterfaceSchema,
};
