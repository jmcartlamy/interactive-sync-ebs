const { validateUserInterface } = require('../validateUserInterface');
const { JOI_VALIDATION_ERROR } = require('../constants');

describe('user interface contains a correct config object', () => {
    test('config is empty and fill with default values', () => {
        const data = {
            id: '1',
        };
        const result = {
            id: '1',
            config: {
                ripple: true,
                transparent: false,
            },
        };
        const value = validateUserInterface(data);

        expect(value).toMatchObject({ isValidUI: true });
        expect(value).toMatchObject({ normalizedUI: result });
    });
    test('config contains properties without `transparent` property', () => {
        const data = {
            id: '1',
            config: {
                ripple: false,
            },
        };
        const result = {
            id: '1',
            config: {
                ripple: false,
                transparent: false,
            },
        };
        const value = validateUserInterface(data);

        expect(value).toMatchObject({ isValidUI: true });
        expect(value).toMatchObject({ normalizedUI: result });
    });
    test('config contains properties without `ripple` property', () => {
        const data = {
            id: '1',
            config: {
                transparent: true,
            },
        };
        const result = {
            id: '1',
            config: {
                ripple: true,
                transparent: true,
            },
        };
        const value = validateUserInterface(data);

        expect(value).toMatchObject({ isValidUI: true });
        expect(value).toMatchObject({ normalizedUI: result });
    });
    test('config contains a ripple and transparent which allow 1 or 0', () => {
        const value1 = validateUserInterface({
            id: '1',
            config: {
                transparent: 2,
            },
        });

        expect(value1).toMatchObject({ isValidUI: false });
        expect(value1).toMatchObject({
            errorUI: expect.stringMatching(new RegExp(JOI_VALIDATION_ERROR.boolean)),
        });

        const value2 = validateUserInterface({
            id: '1',
            config: {
                transparent: 1,
                ripple: 0,
            },
        });

        expect(value2).toMatchObject({ isValidUI: true });
        expect(value2).toMatchObject({
            normalizedUI: {
                id: '1',
                config: {
                    transparent: true,
                    ripple: false,
                },
            },
        });
    });
});
