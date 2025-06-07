const { param, validationResult, matchedData } = require("express-validator")
const createHttpError = require("http-errors")
const { getCarModels } = require("../db/queries")

const carModelValidation = [param("id").isInt({ min: 0 })]

exports.getCarModel = [
    carModelValidation,
    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return next()
        }
        const { id } = matchedData(req)

        await

        res.send("GET Car model : " + id)
    },
]

exports.getCarModels = [
    async (req, res) => {
        const models = await getCarModels()
        res.json(models)
    },
]
