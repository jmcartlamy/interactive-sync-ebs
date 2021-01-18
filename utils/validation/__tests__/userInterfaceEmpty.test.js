const { validateUserInterface } = require('../validateUserInterface');
const { JOI_VALIDATION_ERROR } = require('../constants');

describe('user interface contains nothing', () => {
    test('ui is an empty object', () => {
        expect(validateUserInterface({})).toMatchObject({ isValidUI: true });
        expect(validateUserInterface({})).toMatchObject({ normalizedUI: {} });
    });
    test('ui is not something else', () => {
        expect(validateUserInterface(null)).toMatchObject({ isValidUI: false });
        expect(validateUserInterface(null)).toMatchObject({
            errorUI: expect.stringMatching(new RegExp(JOI_VALIDATION_ERROR.object)),
        });
        expect(validateUserInterface('a')).toMatchObject({ isValidUI: false });
        expect(validateUserInterface('a')).toMatchObject({
            errorUI: expect.stringMatching(new RegExp(JOI_VALIDATION_ERROR.object)),
        });
    });
});
