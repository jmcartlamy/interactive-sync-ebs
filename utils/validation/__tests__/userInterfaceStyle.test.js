const { validateUserInterface } = require('../validateUserInterface');
const { JOI_VALIDATION_ERROR } = require('../constants');

function insertExtensionComponents(data) {
    return {
        id: '1',
        mobile: {
            style: data,
        },
    };
}

describe('user interface contains a correct `style` item object', () => {
    test('style contains an authorized property', () => {
        const value = validateUserInterface(
            insertExtensionComponents({
                color: '#124578',
            })
        );

        expect(value).toMatchObject({ isValidUI: true });
        expect(value).toMatchObject({
            normalizedUI: insertExtensionComponents({
                color: '#124578',
            }),
        });
    });
    test('style contains an unauthorized property', () => {
        const value = validateUserInterface(
            insertExtensionComponents({
                content: 'bonjour',
            })
        );

        expect(value).toMatchObject({ isValidUI: false });
        expect(value).toMatchObject({
            errorUI: expect.stringMatching(new RegExp(JOI_VALIDATION_ERROR.notAllowed)),
        });
    });
    test('style has an object which must contains <= 8 items', () => {
        const data1 = {
            backgroundColor: '#000',
            color: '#ffffff',
            fontSize: '22px',
            width: '100%',
            height: '50px',
            position: 'absolute',
            margin: 0,
            padding: 0,
        };
        const value1 = validateUserInterface(insertExtensionComponents(data1));

        expect(value1).toMatchObject({ isValidUI: true });
        expect(value1).toMatchObject({
            normalizedUI: insertExtensionComponents(data1),
        });
        const data2 = {
            backgroundColor: '#000',
            color: '#ffffff',
            fontSize: '22px',
            width: '100%',
            height: '50px',
            position: 'absolute',
            margin: 0,
            padding: 0,
            display: 'flex',
        };
        const value2 = validateUserInterface(insertExtensionComponents(data2));

        expect(value2).toMatchObject({ isValidUI: false });
        expect(value2).toMatchObject({
            errorUI: expect.stringMatching(new RegExp(JOI_VALIDATION_ERROR.lessOrEqualObject)),
        });
    });
    test('style contains an item with a length <= 128 characters', () => {
        const value = validateUserInterface(
            insertExtensionComponents({
                color:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ac ligula aliquam, vulputate erat sed, vestibulum lectus. Donec tincidunt',
            })
        );

        expect(value).toMatchObject({ isValidUI: false });
        expect(value).toMatchObject({
            errorUI: expect.stringMatching(
                new RegExp(JOI_VALIDATION_ERROR.lessOrEqualLengthString + ' 128')
            ),
        });
    });
    test('style contains an item with a length <= 128 characters', () => {
        const value = validateUserInterface(
            insertExtensionComponents({
                color:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ac ligula aliquam, vulputate erat sed, vestibulum lectus. Donec tincidunt',
            })
        );

        expect(value).toMatchObject({ isValidUI: false });
        expect(value).toMatchObject({
            errorUI: expect.stringMatching(
                new RegExp(JOI_VALIDATION_ERROR.lessOrEqualLengthString + ' 128')
            ),
        });
    });
    test('style contains an item with -10001 et +10001', () => {
        const value1 = validateUserInterface(
            insertExtensionComponents({
                margin: -10001,
            })
        );

        expect(value1).toMatchObject({ isValidUI: false });
        expect(value1).toMatchObject({
            errorUI: expect.stringMatching(
                new RegExp(JOI_VALIDATION_ERROR.greaterThanLengthNumber + ' -10000')
            ),
        });
        const value2 = validateUserInterface(
            insertExtensionComponents({
                margin: 10001,
            })
        );

        expect(value2).toMatchObject({ isValidUI: false });
        expect(value2).toMatchObject({
            errorUI: expect.stringMatching(
                new RegExp(JOI_VALIDATION_ERROR.lessOrEqualLengthNumber + ' 10000')
            ),
        });
    });
});
