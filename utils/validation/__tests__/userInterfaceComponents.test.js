const { validateUserInterface } = require('../validateUserInterface');
const { JOI_VALIDATION_ERROR } = require('../constants');

describe('user interface contains a correct `components[]` item object', () => {
    test('component contains the minimum required', () => {
        const value1 = validateUserInterface({
            id: '1',
            panel: {
                components: [{}],
            },
        });

        expect(value1).toMatchObject({ isValidUI: false });
        expect(value1).toMatchObject({
            errorUI: expect.stringMatching(new RegExp(JOI_VALIDATION_ERROR.required)),
        });
        const value2 = validateUserInterface({
            id: '1',
            panel: {
                components: [
                    {
                        type: 'title',
                    },
                ],
            },
        });

        expect(value2).toMatchObject({ isValidUI: true });
    });
    test('component contains a type valid', () => {
        const data = {
            id: '1',
            panel: {
                components: [
                    {
                        type: 'html',
                        name: 'azerty',
                    },
                ],
            },
        };
        const value = validateUserInterface(data);

        expect(value).toMatchObject({ isValidUI: false });
        expect(value).toMatchObject({
            errorUI: expect.stringMatching(
                new RegExp(JOI_VALIDATION_ERROR.oneOf + ' \\[title, button\\]')
            ),
        });
    });
    test('component contains an id specification html4 name', () => {
        const data = {
            id: '1',
            panel: {
                components: [
                    {
                        type: 'title',
                        name: '$123$',
                    },
                ],
            },
        };
        const value = validateUserInterface(data);

        expect(value).toMatchObject({ isValidUI: false });
        expect(value).toMatchObject({
            errorUI: expect.stringMatching(new RegExp(JOI_VALIDATION_ERROR.pattern)),
        });
    });
    test('component contains a minimum name length', () => {
        const data = {
            id: '1',
            panel: {
                components: [
                    {
                        type: 'title',
                        name: 'a',
                    },
                ],
            },
        };
        const value = validateUserInterface(data);

        expect(value).toMatchObject({ isValidUI: false });
        expect(value).toMatchObject({
            errorUI: expect.stringMatching(new RegExp(JOI_VALIDATION_ERROR.atLeastLengthString)),
        });
    });
    test('component contains a name if type is `button`', () => {
        const value1 = validateUserInterface({
            id: '1',
            panel: {
                components: [
                    {
                        type: 'button',
                    },
                ],
            },
        });

        expect(value1).toMatchObject({ isValidUI: false });
        expect(value1).toMatchObject({
            errorUI: expect.stringMatching(new RegExp(JOI_VALIDATION_ERROR.required)),
        });
        const value2 = validateUserInterface({
            id: '1',
            panel: {
                components: [
                    {
                        type: 'button',
                        name: 'name',
                    },
                ],
            },
        });

        expect(value2).toMatchObject({ isValidUI: true });
    });

    test('component contains a default label', () => {
        const data = {
            id: '1',
            panel: {
                components: [
                    {
                        type: 'title',
                        name: 'azerty',
                    },
                ],
            },
        };
        const result = {
            id: '1',
            panel: {
                components: [
                    {
                        type: 'title',
                        name: 'azerty',
                        label: 'A label',
                    },
                ],
            },
        };
        const value = validateUserInterface(data);

        expect(value).toMatchObject({ isValidUI: true });
        expect(value).toMatchObject({ normalizedUI: result });
    });
    test('component allow an empty string for label', () => {
        const data = {
            id: '1',
            panel: {
                components: [
                    {
                        type: 'title',
                        name: 'azerty',
                        label: '',
                    },
                ],
            },
        };
        const value = validateUserInterface(data);

        expect(value).toMatchObject({ isValidUI: true });
        expect(value).toMatchObject({ normalizedUI: data });
    });
    test('component contains an alphanum keyCode', () => {
        const data = {
            id: '1',
            panel: {
                components: [
                    {
                        type: 'title',
                        name: 'name',
                        keyCode: '$123$',
                    },
                ],
            },
        };
        const value = validateUserInterface(data);

        expect(value).toMatchObject({ isValidUI: false });
        expect(value).toMatchObject({
            errorUI: expect.stringMatching(new RegExp(JOI_VALIDATION_ERROR.alphanum)),
        });
    });
    test('component contains a style object', () => {
        const data = {
            id: '1',
            panel: {
                components: [
                    {
                        type: 'title',
                        name: 'name',
                        style: {},
                    },
                ],
            },
        };
        const value = validateUserInterface(data);

        expect(value).toMatchObject({ isValidUI: true });
        expect(value).toMatchObject({ normalizedUI: data });
    });
    test('component contains a cooldown with default values', () => {
        const data = {
            id: '1',
            panel: {
                components: [
                    {
                        type: 'title',
                        name: 'name',
                    },
                ],
            },
        };
        const result = {
            id: '1',
            panel: {
                components: [
                    {
                        type: 'title',
                        name: 'name',
                        cooldown: {
                            duration: 10000,
                            broadcast: true,
                        },
                    },
                ],
            },
        };
        const value = validateUserInterface(data);
        expect(value).toMatchObject({ isValidUI: true });
        expect(value).toMatchObject({ normalizedUI: result });
    });
    test('component contains a cooldown.broadcast which allow 1 or 0', () => {
        const data = {
            id: '1',
            panel: {
                components: [
                    {
                        type: 'title',
                        name: 'name',
                        cooldown: {
                            duration: 5000,
                            broadcast: 0,
                        },
                    },
                ],
            },
        };
        const result = {
            id: '1',
            panel: {
                components: [
                    {
                        type: 'title',
                        name: 'name',
                        cooldown: {
                            duration: 5000,
                            broadcast: false,
                        },
                    },
                ],
            },
        };
        const value = validateUserInterface(data);
        expect(value).toMatchObject({ isValidUI: true });
        expect(value).toMatchObject({ normalizedUI: result });
    });
    test('component contains a cooldown.style object', () => {
        const data = {
            id: '1',
            panel: {
                components: [
                    {
                        type: 'title',
                        name: 'name',
                        cooldown: {
                            duration: 5000,
                            broadcast: 0,
                            style: {},
                        },
                    },
                ],
            },
        };
        const result = {
            id: '1',
            panel: {
                components: [
                    {
                        type: 'title',
                        name: 'name',
                        cooldown: {
                            duration: 5000,
                            broadcast: false,
                            style: {},
                        },
                    },
                ],
            },
        };
        const value = validateUserInterface(data);
        expect(value).toMatchObject({ isValidUI: true });
        expect(value).toMatchObject({ normalizedUI: result });
    });
    test('component contains an extension object with default values', () => {
        const data = {
            id: '1',
            panel: {
                components: [
                    {
                        type: 'title',
                        name: 'name',
                        extension: {},
                    },
                ],
            },
        };
        const result = {
            id: '1',
            panel: {
                components: [
                    {
                        type: 'title',
                        name: 'name',
                        extension: {
                            submit: {
                                label: 'Submit',
                            },
                        },
                    },
                ],
            },
        };
        const value = validateUserInterface(data);
        expect(value).toMatchObject({ isValidUI: true });
        expect(value).toMatchObject({ normalizedUI: result });
    });
    test('component contains a extension.title.label with minimum length', () => {
        const data = {
            id: '1',
            panel: {
                components: [
                    {
                        type: 'title',
                        name: 'name',
                        extension: {
                            title: {
                                label: 'a',
                            },
                        },
                    },
                ],
            },
        };
        const value = validateUserInterface(data);
        expect(value).toMatchObject({ isValidUI: false });
        expect(value).toMatchObject({
            errorUI: expect.stringMatching(
                new RegExp(JOI_VALIDATION_ERROR.atLeastLengthString + ' 2')
            ),
        });
    });
    test('component contains a extension.title.style object', () => {
        const data = {
            id: '1',
            panel: {
                components: [
                    {
                        type: 'title',
                        name: 'name',
                        extension: {
                            title: {
                                label: 'label',
                                style: {},
                            },
                        },
                    },
                ],
            },
        };
        const value = validateUserInterface(data);
        expect(value).toMatchObject({ isValidUI: true });
        expect(value).toMatchObject({ normalizedUI: data });
    });
    test('component contains a extension.submit.label which allow an empty string', () => {
        const data = {
            id: '1',
            panel: {
                components: [
                    {
                        type: 'title',
                        name: 'name',
                        extension: {
                            submit: {
                                label: '',
                            },
                        },
                    },
                ],
            },
        };
        const value = validateUserInterface(data);
        expect(value).toMatchObject({ isValidUI: true });
        expect(value).toMatchObject({ normalizedUI: data });
    });
    test('component contains a extension.submit.style object', () => {
        const data = {
            id: '1',
            panel: {
                components: [
                    {
                        type: 'title',
                        name: 'name',
                        extension: {
                            submit: {
                                label: '',
                                style: {},
                            },
                        },
                    },
                ],
            },
        };
        const value = validateUserInterface(data);
        expect(value).toMatchObject({ isValidUI: true });
        expect(value).toMatchObject({ normalizedUI: data });
    });
    test('component contains a extension.style object', () => {
        const data = {
            id: '1',
            panel: {
                components: [
                    {
                        type: 'title',
                        name: 'name',
                        extension: {
                            style: {},
                        },
                    },
                ],
            },
        };
        const value = validateUserInterface(data);
        expect(value).toMatchObject({ isValidUI: true });
        expect(value).toMatchObject({ normalizedUI: data });
    });
    test('component contains a extension.components array with at least 1 item', () => {
        const data = {
            id: '1',
            panel: {
                components: [
                    {
                        type: 'title',
                        name: 'name',
                        extension: {
                            components: [],
                        },
                    },
                ],
            },
        };
        const value = validateUserInterface(data);

        expect(value).toMatchObject({ isValidUI: false });
        expect(value).toMatchObject({
            errorUI: expect.stringMatching(new RegExp(JOI_VALIDATION_ERROR.atLeastArray + ' 1')),
        });
    });
    test('component contains a extension.components array with <= 3 items', () => {
        const data = {
            id: '1',
            panel: {
                components: [
                    {
                        type: 'title',
                        name: 'name',
                        extension: {
                            components: [
                                {
                                    type: 'title',
                                    name: 'name1',
                                },
                                {
                                    type: 'title',
                                    name: 'name2',
                                },
                                {
                                    type: 'input',
                                    name: 'name3',
                                },
                                {
                                    type: 'title',
                                    name: 'name4',
                                },
                            ],
                        },
                    },
                ],
            },
        };
        const value = validateUserInterface(data);

        expect(value).toMatchObject({ isValidUI: false });
        expect(value).toMatchObject({
            errorUI: expect.stringMatching(
                new RegExp(JOI_VALIDATION_ERROR.lessOrEqualArray + ' 3')
            ),
        });
    });
    test('component contains a extension.components without duplicate name', () => {
        const data = {
            id: '1',
            panel: {
                components: [
                    {
                        type: 'title',
                        name: 'name',
                        extension: {
                            components: [
                                {
                                    type: 'title',
                                    name: 'name',
                                },
                                {
                                    type: 'input',
                                    name: 'name',
                                },
                            ],
                        },
                    },
                ],
            },
        };
        const value = validateUserInterface(data);

        expect(value).toMatchObject({ isValidUI: false });
        expect(value).toMatchObject({
            errorUI: expect.stringMatching(new RegExp(JOI_VALIDATION_ERROR.duplicate)),
        });
    });
});
