const { validateUserInterface } = require('../validateUserInterface');
const { JOI_VALIDATION_ERROR } = require('../constants');

describe('user interface contains a correct panel object', () => {
    test('panel is empty', () => {
        const data = { id: '1', panel: {} };
        const value = validateUserInterface(data);

        expect(value).toMatchObject({ isValidUI: true });
        expect(value).toMatchObject({ normalizedUI: data });
    });
    test('panel contains only the `components` array', () => {
        const data = { id: '1', panel: { title: 'title' } };
        const value = validateUserInterface(data);

        expect(value).toMatchObject({ isValidUI: false });
        expect(value).toMatchObject({
            errorUI: expect.stringMatching(new RegExp(JOI_VALIDATION_ERROR.notAllowed)),
        });
    });
    test('panel has a `components` array which must contains 1 item', () => {
        const value1 = validateUserInterface({
            id: '1',
            panel: {
                components: [],
            },
        });

        expect(value1).toMatchObject({ isValidUI: false });
        expect(value1).toMatchObject({
            errorUI: expect.stringMatching(new RegExp(JOI_VALIDATION_ERROR.atLeastArray + ' 1')),
        });

        const data = {
            id: '1',
            panel: {
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
    test('panel has a `components` array which must contains <= 4 items', () => {
        const data = {
            id: '1',
            panel: {
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
            errorUI: expect.stringMatching(new RegExp(JOI_VALIDATION_ERROR.lessOrEqualArray + ' 4')),
        });
    });
    test('panel contains a `components` array without duplicate items', () => {
        const data = {
            id: '1',
            panel: {
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
    test('panel contains a `components` array with 2 uniques items', () => {
        const data = {
            id: '1',
            panel: {
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
    test('panel contains a `components[x].type` valid', () => {
        const data = {
            id: '1',
            panel: {
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
