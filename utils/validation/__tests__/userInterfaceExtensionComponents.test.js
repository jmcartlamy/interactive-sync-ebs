const { validateUserInterface } = require('../validateUserInterface');
const { JOI_VALIDATION_ERROR } = require('../constants');

function insertExtensionComponents(data) {
    return {
        id: '1',
        panel: {
            components: [
                {
                    type: 'title',
                    name: 'name',
                    extension: {
                        components: [data],
                    },
                },
            ],
        },
    };
}

describe('user interface contains a correct `components[].extension.components[]` item object', () => {
    test('component contains the minimum required', () => {
        const value1 = validateUserInterface(insertExtensionComponents({}));

        expect(value1).toMatchObject({ isValidUI: false });
        expect(value1).toMatchObject({
            errorUI: expect.stringMatching(new RegExp(JOI_VALIDATION_ERROR.required)),
        });
        const value2 = validateUserInterface(
            insertExtensionComponents({
                type: 'input',
                name: 'name',
            })
        );

        expect(value2).toMatchObject({ isValidUI: true });
    });
    test('component contains a type valid', () => {
        const data = {
            type: 'html',
            name: 'azerty',
        };
        const value = validateUserInterface(insertExtensionComponents(data));

        expect(value).toMatchObject({ isValidUI: false });
        expect(value).toMatchObject({
            errorUI: expect.stringMatching(
                new RegExp(JOI_VALIDATION_ERROR.oneOf + ' \\[title, input, image\\]')
            ),
        });
    });
    test('component contains an id specification html4 name', () => {
        const data = {
            type: 'title',
            name: '$123$',
        };
        const value = validateUserInterface(insertExtensionComponents(data));

        expect(value).toMatchObject({ isValidUI: false });
        expect(value).toMatchObject({
            errorUI: expect.stringMatching(new RegExp(JOI_VALIDATION_ERROR.pattern)),
        });
    });
    test('component contains a minimum name length', () => {
        const data = {
            type: 'title',
            name: 'a',
        };
        const value = validateUserInterface(insertExtensionComponents(data));

        expect(value).toMatchObject({ isValidUI: false });
        expect(value).toMatchObject({
            errorUI: expect.stringMatching(new RegExp(JOI_VALIDATION_ERROR.atLeastLengthString)),
        });
    });
    test('component contains a name if type is `input`', () => {
        const value1 = validateUserInterface(
            insertExtensionComponents({
                type: 'input',
            })
        );

        expect(value1).toMatchObject({ isValidUI: false });
        expect(value1).toMatchObject({
            errorUI: expect.stringMatching(new RegExp(JOI_VALIDATION_ERROR.required)),
        });
        const value2 = validateUserInterface(
            insertExtensionComponents({
                type: 'input',
                name: 'azerty',
            })
        );

        expect(value2).toMatchObject({ isValidUI: true });
    });
    test('component contains a src property only if type is `image`', () => {
        const value = validateUserInterface(
            insertExtensionComponents({
                type: 'image',
                name: 'azerty',
                src: '$url$',
            })
        );

        expect(value).toMatchObject({ isValidUI: true });
        expect(value).toMatchObject({
            normalizedUI: insertExtensionComponents({
                type: 'image',
                name: 'azerty',
                src: '$url$',
            }),
        });
    });
    test('component contains a src property which is required only if type is `image`', () => {
        const value = validateUserInterface(
            insertExtensionComponents({
                type: 'image',
                name: 'azerty',
            })
        );

        expect(value).toMatchObject({ isValidUI: false });
        expect(value).toMatchObject({
            errorUI: expect.stringMatching(new RegExp(JOI_VALIDATION_ERROR.required)),
        });
    });
    test('component allow an empty string for label', () => {
        const data = {
            type: 'title',
            name: 'name',
            label: '',
        };
        const value = validateUserInterface(insertExtensionComponents(data));

        expect(value).toMatchObject({ isValidUI: true });
        expect(value).toMatchObject({ normalizedUI: insertExtensionComponents(data) });
    });
    test('component contains a placeholder', () => {
        const data = {
            type: 'title',
            name: 'name',
            label: 'label',
            placeholder: 'placeholder',
        };
        const value = validateUserInterface(insertExtensionComponents(data));

        expect(value).toMatchObject({ isValidUI: true });
        expect(value).toMatchObject({ normalizedUI: insertExtensionComponents(data) });
    });
    test('component allow an empty string for placeholder', () => {
        const data = {
            type: 'title',
            name: 'name',
            label: 'label',
            placeholder: '',
        };
        const value = validateUserInterface(insertExtensionComponents(data));

        expect(value).toMatchObject({ isValidUI: true });
        expect(value).toMatchObject({ normalizedUI: insertExtensionComponents(data) });
    });
    test('component contains a style object', () => {
        const data = {
            type: 'title',
            name: 'name',
            label: 'label',
            style: {},
        };
        const value = validateUserInterface(insertExtensionComponents(data));

        expect(value).toMatchObject({ isValidUI: true });
        expect(value).toMatchObject({ normalizedUI: insertExtensionComponents(data) });
    });
});
