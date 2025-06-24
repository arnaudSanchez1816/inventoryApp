const {
    param,
    validationResult,
    matchedData,
    body,
} = require("express-validator")
const { getConstructorDetails, getConstructors } = require("../db/queries")
const createHttpError = require("http-errors")

const constructorIdParamValidation = [param("id").isInt({ min: 0 })]
const constructorBodyValidation = [
    body("name")
        .trim()
        .isString()
        .notEmpty()
        .withMessage("Name field is empty"),
    body("country")
        .trim()
        .isString()
        .notEmpty()
        .withMessage("Country field is empty"),
]

exports.getConstructor = [
    constructorIdParamValidation,
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

        res.render("constructor", {
            title: "Auto Inventory",
            constructor: constructorDetails,
        })
    },
]

exports.getConstructors = async (req, res) => {
    const constructors = await getConstructors({ sortBy: "name" })

    const constructorMap = {}
    constructors.forEach((c) => {
        const initial = c.name.toUpperCase()[0]
        let mapKey = "others"
        if (initial.match(/[A-Z]/)) {
            mapKey = initial
        }
        if (!constructorMap[mapKey]) {
            constructorMap[mapKey] = []
        }

        constructorMap[mapKey].push(c)
    })

    res.render("constructors", {
        constructorMap: constructorMap,
        title: "Auto Inventory",
    })
}

exports.postNewConstructor = [
    constructorBodyValidation,
    (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw createHttpError(400, errors.array())
        }
        res.send("POST new constructor")
    },
]

exports.postUpdateConstructor = [
    constructorIdParamValidation,
    constructorBodyValidation,
    (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const errorMap = errors.mapped()
            if (errorMap.id) {
                throw createHttpError(404, "Constructor not found")
            }
            throw createHttpError(400, errors.array())
        }
        res.send("POST update constructor")
    },
]

exports.deleteConstructor = [
    constructorIdParamValidation,
    (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw createHttpError(404, errors.array())
        }
        res.send("DELETE constructor")
    },
]
