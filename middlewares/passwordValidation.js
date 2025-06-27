const { body, validationResult, matchedData } = require("express-validator")
const createHttpError = require("http-errors")

exports.validatePassword = [
    body("password")
        .trim()
        .escape()
        .notEmpty()
        .isString()
        .withMessage("Password invalid"),
    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw createHttpError(403, "Invalid password", errors.array())
        }

        const { password } = matchedData(req)
        const appPassword = process.env["APP_PASSWORD"]
        console.log(password)

        if (password !== appPassword) {
            throw createHttpError(403, "Invalid password")
        }

        next()
    },
]
