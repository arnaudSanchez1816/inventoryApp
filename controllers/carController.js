const { param, validationResult, matchedData } = require("express-validator")
const createHttpError = require("http-errors")

const carModelValidation = [param("id").isInt({ min: 0 })]

exports.getCarModel = [
    carModelValidation,
    (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw createHttpError(404, "Car model not found")
        }
        const { id } = matchedData(req)
        res.send("GET Car model : " + id)
    },
]
