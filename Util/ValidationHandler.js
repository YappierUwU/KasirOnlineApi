const { validationResult } = require("express-validator");

const resultValidation = validationResult.withDefaults({
    formatter: (error) => {
        return {
            field: error.param,
            message: error.msg,
        };
    },
});

function handlerInput(req, res, next) {
    let error = resultValidation(req);
    if (!error.isEmpty()) {
        const message = error[0].message;
        res.status(406).json({ status: false, message });
    } else {
        next();
    }
}

module.exports = handlerInput;