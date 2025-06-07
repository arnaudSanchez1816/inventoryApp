const { param, validationResult, matchedData } = require("express-validator")
const createHttpError = require("http-errors")
const { getConstructorDetails } = require("../db/queries")

const getConstructorValidation = [param("id").isInt({ min: 0 })]

exports.getConstructor = [
    getConstructorValidation,
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw createHttpError(404, "Constructor not found")
        }

        const { id } = matchedData(req)

        const constructorDetails = await getConstructorDetails(id)

        res.json(constructorDetails)
    },
]
