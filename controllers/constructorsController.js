const { param, validationResult, matchedData } = require("express-validator")
const { getConstructorDetails, getConstructors } = require("../db/queries")
const createHttpError = require("http-errors")

const getConstructorValidation = [param("id").isInt({ min: 0 })]

exports.getConstructor = [
    getConstructorValidation,
    async (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return next()
        }

        const { id } = matchedData(req)

        const constructorDetails = await getConstructorDetails(id)
        if (!constructorDetails) {
            throw createHttpError(404, "Constructor not found")
        }

        res.json(constructorDetails)
    },
]

exports.getConstructors = async (req, res) => {
    const constructors = await getConstructors()

    res.json(constructors)
}

exports.getNewConstructor = (req, res) => {
    res.send("GET new constructor")
}

const postNewConstructorValidation = []

exports.postNewConstructor = [
    postNewConstructorValidation,
    (req, res) => {
        res.send("POST new constructor")
    },
]
