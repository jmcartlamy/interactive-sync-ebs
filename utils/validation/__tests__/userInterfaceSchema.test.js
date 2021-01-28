const { validateUserInterface } = require('../validateUserInterface');

describe('user interface is fully correct', () => {
    test('an example of user interface', () => {
        const data = {
            id: '1',
            mobile: {
                title: {
                    label: 'Créez des personnages avec les boutons',
                },
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
                title: {
                    label: 'Créez des rebelles avec les boutons',
                },
                components: [
                    {
                        type: 'button',
                        name: 'action-rebel',
                        label: 'Créer un rebelle',
                        keyCode: 'Digit1',
                        extension: {
                            title: {
                                label: 'Créer un REBELLE',
                            },
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
                            title: {
                                label: 'Créer un REBELLE',
                            },
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
                                title: {
                                    label: 'Créer un REBELLE',
                                },
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
    test('an third example of user interface', () => {
        const data = {
            id: '1',
            video_overlay: {
                bottom: {
                    components: [
                        {
                            type: 'title',
                            label: 'Créez des rebelles avec les boutons',
                            style: {
                                backgroundColor: '#453298',
                                color: '#fff',
                            },
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
                                title: {
                                    label: 'Créer un REBELLE',
                                    style: {
                                        backgroundColor: '#453298',
                                        color: '#fff',
                                    },
                                },
                                style: {
                                    backgroundColor: '#8474c9',
                                    color: '#fff',
                                },
                                submit: {
                                    label: '#YOLO',
                                    style: {
                                        backgroundColor: '#453298',
                                        color: '#fff',
                                    },
                                },
                                components: [
                                    {
                                        type: 'input',
                                        name: 'ext-teaser-quote',
                                        label: 'Votre discours',
                                        style: {
                                            backgroundColor: '#453298',
                                        },
                                        placeholder: 'Ecrivez ici',
                                    },
                                ],
                            },
                            style: {
                                backgroundColor: '#453298',
                                color: '#fff',
                            },
                            cooldown: {
                                duration: 20000,
                                broadcast: false,
                                style: {
                                    backgroundColor: 'rgba(25,74,22, 0.7)',
                                    color: '#fff',
                                    fontSize: 26,
                                },
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
