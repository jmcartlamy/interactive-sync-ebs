const Joi = require('joi');

const REGEX_ID_SPECIFICATION_HTML4 = /^[A-Za-z]+[\w\-\:\.]*$/;

const AUTHORIZED_STYLE = [
    'backgroundColor',
    'background',
    'color',
    'fontSize',
    'width',
    'height',
    'maxWidth',
    'maxHeight',
    'position',
    'display',
    'margin',
    'padding',
    'justifyContent',
    'alignItems',
    'alignSelf',
    'borderImage',
    'imageRendering',
    'cursor',
];

const styleSchema = Joi.object()
    .pattern(Joi.string().valid(...AUTHORIZED_STYLE), [
        Joi.string().allow('').max(128, 'utf8'),
        Joi.number().min(-10000).max(10000),
    ])
    .max(8);

const styleMouseSchema = Joi.object({
    cursor: Joi.string().max(128, 'utf8'),
});

const extensionComponentSchema = Joi.object({
    type: Joi.string().valid('title', 'input', 'image', 'text', 'radio', 'checkbox').required(),
    name: Joi.string()
        .pattern(REGEX_ID_SPECIFICATION_HTML4)
        .min(3)
        .max(64)
        .when('type', [
            { is: 'input', then: Joi.required() },
            { is: 'radio', then: Joi.required() },
            { is: 'checkbox', then: Joi.required() },
        ]),
    label: Joi.string().allow('').max(96),
    src: Joi.string().max(128, 'utf8').when('type', { is: 'image', then: Joi.required() }),
    text: Joi.string().max(256, 'utf8').when('type', { is: 'text', then: Joi.required() }),
    template: Joi.string()
        .valid('classic', 'button')
        .when('type', [
            { is: 'radio', then: Joi.required() },
            { is: 'checkbox', then: Joi.required() },
        ]),
    values: Joi.object()
        .pattern(Joi.string().alphanum().max(64), Joi.string().allow('').max(128, 'utf8'))
        .min(1)
        .max(4)
        .when('type', [
            { is: 'radio', then: Joi.required() },
            { is: 'checkbox', then: Joi.required() },
        ]),
    style: styleSchema,
    styleValues: styleSchema,
    placeholder: Joi.string().allow('').max(32),
});

const componentSchema = Joi.object({
    type: Joi.string().valid('title', 'button', 'image', 'text').required(),
    name: Joi.string()
        .pattern(REGEX_ID_SPECIFICATION_HTML4)
        .min(3)
        .max(64)
        .when('type', { is: 'button', then: Joi.required() }),
    label: Joi.string().allow('').max(96).default('A label'),
    src: Joi.string().max(128, 'utf8').when('type', { is: 'image', then: Joi.required() }),
    text: Joi.string().max(256, 'utf8').when('type', { is: 'text', then: Joi.required() }),
    keyCode: Joi.string().alphanum().max(64),
    style: styleSchema,
    cooldown: Joi.object({
        duration: Joi.number().min(3000).max(60000).default(10000),
        broadcast: Joi.boolean().truthy(1).falsy(0).default(true),
        style: styleSchema,
    }).default({ duration: 10000, broadcast: true }),
    extension: Joi.object({
        title: Joi.object({
            label: Joi.string().min(2).max(96),
            style: styleSchema,
        }),
        submit: Joi.object({
            label: Joi.string().allow('').max(64).default('Submit'),
            style: styleSchema,
        }).default({ label: 'Submit' }),
        style: styleSchema,
        components: Joi.array().items(extensionComponentSchema).min(1).max(3).unique('name'),
    }),
});

const objectComponentSchema = Joi.object({
    components: Joi.array().items(componentSchema).min(1).max(4).unique('name'),
});

const configSchema = Joi.object({
    transparent: Joi.boolean().truthy(1).falsy(0).default(false),
    ripple: Joi.boolean().truthy(1).falsy(0).default(true),
    forceTheme: Joi.string().valid('light', 'dark'),
}).default({ transparent: false, ripple: true });

const userInterfaceSchema = Joi.object({
    id: Joi.string().alphanum().max(64).required(),
    config: configSchema,
    mobile: Joi.object({
        title: Joi.object({
            label: Joi.string().min(2).max(96),
            style: styleSchema,
        }),
        style: styleSchema,
        components: Joi.array().items(componentSchema).min(1).max(4).unique('name'),
    }),
    panel: Joi.object({
        style: styleSchema,
        components: Joi.array().items(componentSchema).min(1).max(4).unique('name'),
    }),
    video_overlay: Joi.object({
        mouse: Joi.array()
            .items(
                Joi.object({
                    type: Joi.string().valid('mousedown', 'mouseup').required(),
                    style: styleMouseSchema,
                    cooldown: Joi.object({
                        duration: Joi.number().min(1000).max(60000).default(3000),
                        limit: Joi.number().min(1).max(10).default(2),
                        style: styleMouseSchema,
                    }).default({ duration: 3000, limit: 2 }),
                })
            )
            .min(1)
            .max(2)
            .unique('type'),
        left: objectComponentSchema,
        bottom: objectComponentSchema,
        right: objectComponentSchema,
        top: objectComponentSchema,
    }),
}).empty({});

module.exports = {
    userInterfaceSchema: userInterfaceSchema,
};
