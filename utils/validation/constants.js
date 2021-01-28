const JOI_VALIDATION_ERROR = {
    required: 'is required',
    string: 'must be a string',
    object: 'must be of type object',
    boolean: 'must be a boolean',
    oneOf: 'must be one of',
    alphanum: 'must only contain alpha-numeric characters',
    pattern: 'fails to match the required pattern',
    notEmpty: 'not allowed to be empty',
    greaterThanLengthNumber: 'greater than or equal to',
    lessOrEqualLengthNumber: 'must be less than or equal to',
    atLeastLengthString: 'length must be at least',
    lessOrEqualLengthString: 'length must be less than or equal to',
    duplicate: 'contains a duplicate value',
    atLeastArray: 'must contain at least',
    lessOrEqualArray: 'must contain less than or equal to',
    lessOrEqualObject: 'must have less than or equal to',
    notAllowed: 'is not allowed',
};
module.exports = {
    JOI_VALIDATION_ERROR: JOI_VALIDATION_ERROR,
};
