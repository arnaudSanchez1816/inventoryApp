const { param, validationResult, matchedData } = require("express-validator")
const createHttpError = require("http-errors")
const { getCarModels, getCarModelDetails } = require("../db/queries")

const carModelValidation = [param("id").isInt({ min: 0 })]

exports.getCarModel = [
    carModelValidation,
    async (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return next()
        }
        const { id } = matchedData(req)

        const modelDetails = await getCarModelDetails(id)
        if (!modelDetails) {
            throw createHttpError(404, "Car model not found")
        }

        res.json(modelDetails)
    },
]

exports.getCarModels = [
    async (req, res) => {
        const models = await getCarModels()
        res.json(models)
    },
]
