const { validateUserInterface } = require('../validateUserInterface');
const { JOI_VALIDATION_ERROR } = require('../constants');

describe('user interface contains a correct id', () => {
    test('id is missing', () => {
        const data = { mobile: {} };
        const value = validateUserInterface(data);

        expect(value).toMatchObject({ isValidUI: false });
        expect(value).toMatchObject({
            errorUI: expect.stringMatching(new RegExp(JOI_VALIDATION_ERROR.required)),
        });
    });
    test('id is a string', () => {
        const data = { id: '1' };
        const value = validateUserInterface(data);

        expect(value).toMatchObject({ isValidUI: true });
        expect(value).toMatchObject({ normalizedUI: data });
    });
    test('id is not a number', () => {
        const data = { id: 1 };
        const value = validateUserInterface(data);

        expect(value).toMatchObject({ isValidUI: false });
        expect(value).toMatchObject({
            errorUI: expect.stringMatching(new RegExp(JOI_VALIDATION_ERROR.string)),
        });
    });
    test('id is not something else than alphanum', () => {
        const data = { id: '$123$' };
        const value = validateUserInterface(data);

        expect(value).toMatchObject({ isValidUI: false });
        expect(value).toMatchObject({
            errorUI: expect.stringMatching(new RegExp(JOI_VALIDATION_ERROR.alphanum)),
        });
    });
    test('id is not empty', () => {
        const data = { id: '' };
        const value = validateUserInterface(data);

        expect(value).toMatchObject({ isValidUI: false });
        expect(value).toMatchObject({
            errorUI: expect.stringMatching(new RegExp(JOI_VALIDATION_ERROR.notEmpty)),
        });
    });
    test('id has a length <= 64 characters', () => {
        const data = {
            id: '62f75dd4666246059568c9cf607e2b650242a2ea13aa46a6a7faa9d4c667239f9568c9c',
        };
        const value = validateUserInterface(data);

        expect(value).toMatchObject({ isValidUI: false });
        expect(value).toMatchObject({
            errorUI: expect.stringMatching(
                new RegExp(JOI_VALIDATION_ERROR.lessOrEqualLengthString + ' 64')
            ),
        });
    });
});
