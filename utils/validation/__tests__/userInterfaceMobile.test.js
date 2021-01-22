const { validateUserInterface } = require('../validateUserInterface');
const { JOI_VALIDATION_ERROR } = require('../constants');

describe('user interface contains a correct mobile object', () => {
    test('mobile is empty', () => {
        const data = { id: '1', mobile: {} };
        const value = validateUserInterface(data);

        expect(value).toMatchObject({ isValidUI: true });
        expect(value).toMatchObject({ normalizedUI: data });
    });
    test('mobile contains an optional title', () => {
        const data = { id: '1', mobile: { title: { label: 'label' } } };
        const value = validateUserInterface(data);

        expect(value).toMatchObject({ isValidUI: true });
        expect(value).toMatchObject({ normalizedUI: data });
    });
    test('mobile contains an optional title.label with a length >= 2 characters', () => {
        const data = {
            id: '1',
            mobile: {
                title: { label: 'a' },
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
    test('mobile contains an optional title.label with a length <= 64 characters', () => {
        const data = {
            id: '1',
            mobile: {
                title: {
                    label:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ac ligula aliquam, vulputate erat sed, vestibulum lectus. Donec tincidunt',
                },
            },
        };
        const value = validateUserInterface(data);

        expect(value).toMatchObject({ isValidUI: false });
        expect(value).toMatchObject({
            errorUI: expect.stringMatching(
                new RegExp(JOI_VALIDATION_ERROR.lessOrEqualLengthString)
            ),
        });
    });
    test('mobile contains an optional title.style', () => {
        const data = {
            id: '1',
            mobile: {
                title: {
                    label: 'title',
                    style: {},
                },
            },
        };
        const value = validateUserInterface(data);

        expect(value).toMatchObject({ isValidUI: true });
        expect(value).toMatchObject({ normalizedUI: data });
    });
    test('mobile has a `components` array which must contains 1 item', () => {
        const value1 = validateUserInterface({
            id: '1',
            mobile: {
                components: [],
            },
        });

        expect(value1).toMatchObject({ isValidUI: false });
        expect(value1).toMatchObject({
            errorUI: expect.stringMatching(new RegExp(JOI_VALIDATION_ERROR.atLeastArray + ' 1')),
        });

        const data = {
            id: '1',
            mobile: {
                components: [
                    {
                        type: 'title',
                        name: 'title',
                        label: 'label',
                    },
                ],
            },
        };
        const value2 = validateUserInterface(data);

        expect(value2).toMatchObject({ isValidUI: true });
        expect(value2).toMatchObject({ normalizedUI: data });
    });
    test('mobile has a `components` array which must contains <= 4 items', () => {
        const data = {
            id: '1',
            mobile: {
                components: [
                    {
                        type: 'title',
                        name: 'title1',
                        label: 'label1',
                    },
                    {
                        type: 'title',
                        name: 'title2',
                        label: 'label2',
                    },
                    {
                        type: 'title',
                        name: 'title3',
                        label: 'label3',
                    },
                    {
                        type: 'title',
                        name: 'title4',
                        label: 'label4',
                    },
                    {
                        type: 'title',
                        name: 'title5',
                        label: 'label5',
                    },
                ],
            },
        };
        const value = validateUserInterface(data);

        expect(value).toMatchObject({ isValidUI: false });
        expect(value).toMatchObject({
            errorUI: expect.stringMatching(
                new RegExp(JOI_VALIDATION_ERROR.lessOrEqualArray + ' 4')
            ),
        });
    });
    test('mobile contains a `components` array without duplicate items', () => {
        const data = {
            id: '1',
            mobile: {
                components: [
                    {
                        type: 'title',
                        name: 'title',
                        label: 'label',
                    },
                    {
                        type: 'title',
                        name: 'title',
                        label: 'label',
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
    test('mobile contains a `components` array with 2 uniques items', () => {
        const data = {
            id: '1',
            mobile: {
                components: [
                    {
                        type: 'title',
                        name: 'title',
                        label: 'label',
                    },
                    {
                        type: 'button',
                        name: 'button',
                        label: 'label',
                    },
                ],
            },
        };
        const value = validateUserInterface(data);

        expect(value).toMatchObject({ isValidUI: true });
        expect(value).toMatchObject({ normalizedUI: data });
    });
    test('mobile contains a `components[x].type` valid', () => {
        const data = {
            id: '1',
            mobile: {
                components: [
                    {
                        type: 'a',
                        name: 'title',
                        label: 'label',
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
});
