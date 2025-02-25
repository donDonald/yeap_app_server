'use strict';

const assert = require('assert');
const { validationResult } = require('express-validator');

// https://dev.to/nedsoft/a-clean-approach-to-using-express-validator-8go
module.exports = function(api) {
    assert(api);

    const validate = (reportFailure, req, res, next) => {
//      console.log('validators.validate()');
        const errors = validationResult(req);
        if (errors.isEmpty()) {
//          console.log('validators.validate, SUCCESS');
            return next();
        }

        res.status(400);
        if (reportFailure == true) {
            const extractedErrors = [];
            errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));
            res.extractedErrors = extractedErrors;
        }
        return next();
    }

    return validate;
}

