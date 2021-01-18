const { validateUserInterface } = require('../validateUserInterface');

describe('user interface is fully correct', () => {
    test('an example of user interface', () => {
        const data = {
            id: '1',
            mobile: {
                title: 'Créez des personnages avec les boutons',
                components: [
                    {
                        type: 'button',
                        name: 'action-zombie',
                        label: 'Créer un zombie',
                        keyCode: 'Digit1',
                        cooldown: {
                            duration: 5000,
                            broadcast: true,
                        },
                    },
                    {
                        type: 'button',
                        name: 'action-ninja',
                        label: 'Créer un ninja',
                        keyCode: 'Digit2',
                        cooldown: {
                            duration: 10000,
                            broadcast: false,
                        },
                    },
                ],
            },
            panel: {
                components: [
                    {
                        type: 'title',
                        label: 'Créez des personnages avec les boutons',
                    },
                    {
                        type: 'button',
                        name: 'action-zombie',
                        label: 'Créer un zombie',
                        keyCode: 'Digit1',
                        cooldown: {
                            duration: 5000,
                            broadcast: true,
                        },
                    },
                    {
                        type: 'button',
                        name: 'action-ninja',
                        label: 'Créer un ninja',
                        keyCode: 'Digit2',
                        cooldown: {
                            duration: 10000,
                            broadcast: false,
                        },
                    },
                ],
            },
            video_overlay: {
                mouse: [
                    {
                        type: 'mousedown',
                        cooldown: {
                            duration: 2000,
                            limit: 2,
                        },
                    },
                ],
                bottom: {
                    components: [
                        {
                            type: 'title',
                            label: 'Créez des personnages avec les boutons',
                        },
                    ],
                },
                left: {
                    components: [
                        {
                            type: 'button',
                            name: 'action-zombie',
                            label: 'Créer un zombie',
                            keyCode: 'Digit1',
                            cooldown: {
                                duration: 5000,
                                broadcast: true,
                            },
                        },
                        {
                            type: 'button',
                            name: 'action-ninja',
                            label: 'Créer un ninja',
                            keyCode: 'Digit2',
                            cooldown: {
                                duration: 10000,
                                broadcast: false,
                            },
                        },
                    ],
                },
            },
        };

        const value = validateUserInterface(data);
        expect(value).toMatchObject({ isValidUI: true });
        expect(value).toMatchObject({ normalizedUI: data });
    });
    test('an other example of user interface', () => {
        const data = {
            id: '1',
            mobile: {
                title: 'Créez des rebelles avec les boutons',
                components: [
                    {
                        type: 'button',
                        name: 'action-rebel',
                        label: 'Créer un rebelle',
                        keyCode: 'Digit1',
                        extension: {
                            title: 'Créer un REBELLE',
                            submit: {
                                label: '#YOLO',
                            },
                            components: [
                                {
                                    type: 'input',
                                    name: 'ext-teaser-quote',
                                    label: 'Votre discours',
                                    placeholder: 'Ecrivez ici',
                                },
                            ],
                        },
                        cooldown: {
                            duration: 10000,
                            broadcast: true,
                        },
                    },
                ],
            },
            panel: {
                components: [
                    {
                        type: 'title',
                        label: 'Créez des rebelles avec les boutons',
                    },
                    {
                        type: 'button',
                        name: 'action-rebel',
                        label: 'Créer un rebelle',
                        keyCode: 'Digit1',
                        extension: {
                            title: 'Créer un REBELLE',
                            submit: {
                                label: '#YOLO',
                            },
                            components: [
                                {
                                    type: 'input',
                                    name: 'ext-teaser-quote',
                                    label: 'Votre discours',
                                    placeholder: 'Ecrivez ici',
                                },
                            ],
                        },
                        cooldown: {
                            duration: 10000,
                            broadcast: false,
                        },
                    },
                ],
            },
            video_overlay: {
                bottom: {
                    components: [
                        {
                            type: 'title',
                            label: 'Créez des rebelles avec les boutons',
                        },
                    ],
                },
                left: {
                    components: [
                        {
                            type: 'button',
                            name: 'action-rebel',
                            label: 'Créer un rebelle',
                            keyCode: 'Digit1',
                            extension: {
                                title: 'Créer un REBELLE',
                                submit: {
                                    label: '#YOLO',
                                },
                                components: [
                                    {
                                        type: 'input',
                                        name: 'ext-teaser-quote',
                                        label: 'Votre discours',
                                        placeholder: 'Ecrivez ici',
                                    },
                                ],
                            },
                            cooldown: {
                                duration: 10000,
                                broadcast: false,
                            },
                        },
                    ],
                },
            },
        };
        const value = validateUserInterface(data);
        expect(value).toMatchObject({ isValidUI: true });
        expect(value).toMatchObject({ normalizedUI: data });
    });
});
