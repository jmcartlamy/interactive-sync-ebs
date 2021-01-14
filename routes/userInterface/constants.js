const JOI_VALIDATION_ERROR = {
    required: 'is required',
    string: 'must be a string',
    object: 'must be of type object',
    oneOf: 'must be one of',
    alphanum: 'must only contain alpha-numeric characters',
    pattern: 'fails to match the required pattern',
    notEmpty: 'not allowed to be empty',
    atLeastLengthString: 'length must be at least',
    lessOrEqualLengthString: 'length must be less than or equal to',
    duplicate: 'contains a duplicate value',
    atLeastArray: 'must contain at least',
    lessOrEqualArray: 'must contain less than or equal to',
    notAllowed: 'is not allowed',
};
module.exports = {
    JOI_VALIDATION_ERROR: JOI_VALIDATION_ERROR,
};
