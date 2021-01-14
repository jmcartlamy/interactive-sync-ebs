const { userInterfaceSchema } = require('./userInterfaceSchema');

const validateUserInterface = function (userInterface) {
    const result = userInterfaceSchema.validate(userInterface, {
        abortEarly: true,
    });

    const output = {
        isValidUI: typeof result.error === 'undefined',
        normalizedUI: result.value,
    };

    if (!output.isValidUI) {
        output.errorUI = process.env.JEST_WORKER_ID !== undefined ? JSON.stringify(result) : result;
    }

    return output;
};

module.exports = {
    validateUserInterface: validateUserInterface,
};
