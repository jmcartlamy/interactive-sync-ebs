const { validateUserInterface } = require('../validateUserInterface');
const { JOI_VALIDATION_ERROR } = require('../constants');

describe('user interface contains a correct video_overlay object', () => {
    test('video_overlay is empty', () => {
        const data = { id: '1', video_overlay: {} };
        const value = validateUserInterface(data);

        expect(value).toMatchObject({ isValidUI: true });
        expect(value).toMatchObject({ normalizedUI: data });
    });
    test('video_overlay has a `mouse` array which must contains 1 item', () => {
        const value1 = validateUserInterface({
            id: '1',
            video_overlay: {
                mouse: [],
            },
        });

        expect(value1).toMatchObject({ isValidUI: false });
        expect(value1).toMatchObject({
            errorUI: expect.stringMatching(new RegExp(JOI_VALIDATION_ERROR.atLeastArray + ' 1')),
        });
        const data = {
            id: '1',
            video_overlay: {
                mouse: [
                    {
                        type: 'mousedown',
                        cooldown: {
                            duration: 1000,
                            limit: 5,
                        },
                    },
                ],
            },
        };
        const value2 = validateUserInterface(data);

        expect(value2).toMatchObject({ isValidUI: true });
        expect(value2).toMatchObject({ normalizedUI: data });
    });
    test('video_overlay has a `mouse` array without duplicate items', () => {
        const data = {
            id: '1',
            video_overlay: {
                mouse: [
                    {
                        type: 'mousedown',
                    },
                    {
                        type: 'mousedown',
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
    test('video_overlay has a `mouse[x].type` valid', () => {
        const data = {
            id: '1',
            video_overlay: {
                mouse: [
                    {
                        type: 'a',
                    },
                ],
            },
        };
        const value = validateUserInterface(data);

        expect(value).toMatchObject({ isValidUI: false });
        expect(value).toMatchObject({
            errorUI: expect.stringMatching(
                new RegExp(JOI_VALIDATION_ERROR.oneOf + ' \\[mousedown, mouseup\\]')
            ),
        });
    });
    test('video_overlay has a `mouse[x].cooldown with default values', () => {
        const data = {
            id: '1',
            video_overlay: {
                mouse: [
                    {
                        type: 'mouseup',
                    },
                ],
            },
        };
        const result = {
            id: '1',
            video_overlay: {
                mouse: [
                    {
                        type: 'mouseup',
                        cooldown: {
                            duration: 3000,
                            limit: 2,
                        },
                    },
                ],
            },
        };
        const value = validateUserInterface(data);

        expect(value).toMatchObject({ isValidUI: true });
        expect(value).toMatchObject({ normalizedUI: result });
    });
    test('video_overlay has a `mouse` array which must contains <= 2 items', () => {
        const data = {
            id: '1',
            video_overlay: {
                mouse: [
                    {
                        type: 'mouseup',
                    },
                    {
                        type: 'mousedown',
                    },
                    {
                        type: 'mousedown',
                    },
                ],
            },
        };
        const value = validateUserInterface(data);

        expect(value).toMatchObject({ isValidUI: false });
        expect(value).toMatchObject({
            errorUI: expect.stringMatching(new RegExp(JOI_VALIDATION_ERROR.lessOrEqualArray + ' 2')),
        });
    });
    test('video_overlay has a left|bottom|right|top property', () => {
        const data = {
            id: '1',
            video_overlay: {
                left: {},
                bottom: {},
                right: {},
                top: {},
            },
        };
        const value = validateUserInterface(data);

        expect(value).toMatchObject({ isValidUI: true });
        expect(value).toMatchObject({ normalizedUI: data });
    });
});
