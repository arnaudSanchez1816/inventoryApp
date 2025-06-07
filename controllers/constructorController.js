const { param, validationResult, matchedData } = require("express-validator")
const { getConstructorDetails, getConstructors } = require("../db/queries")

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

        res.json(constructorDetails)
    },
]

exports.getConstructors = async (req, res) => {
    const constructors = await getConstructors()

    res.json(constructors)
}
