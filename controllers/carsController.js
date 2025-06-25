const {
    param,
    validationResult,
    matchedData,
    body,
} = require("express-validator")
const createHttpError = require("http-errors")
const { getCarModels, getCarModelDetails, getCars } = require("../db/queries")

//Validators
const carModelIdParamValidation = () => [param("id").isInt({ min: 0 }).toInt()]

exports.getCarModel = [
    carModelIdParamValidation(),
    async (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return next()
        }
        const { id } = matchedData(req)

        const [modelDetails, modelCars] = await Promise.all([
            getCarModelDetails(id),
            getCars(id),
        ])

        if (!modelDetails) {
            throw createHttpError(404, "Car model not found")
        }

        res.render("car", {
            title: "Auto inventory",
            model: modelDetails,
            cars: modelCars,
            constructor: modelDetails.constructor,
            powertrains: modelDetails.powertrains,
            trims: modelDetails.trims,
        })
    },
]

exports.getCarModels = [
    async (req, res) => {
        const models = await getCarModels()
        res.json(models)
    },
]

exports.getNewCarModel = (req, res) => {
    res.send("GET new car model")
}

const postNewCarModelValidation = []

exports.postNewCarModel = [
    postNewCarModelValidation,
    (req, res) => {
        res.send("POST new car model")
    },
]

// Configs
exports.addNewCarConfiguration = [
    param("modelId").isInt({ min: 0 }),
    body(["trimId", "powertrainId", "price", "stock"])
        .notEmpty()
        .isInt({ min: 0 }),
    (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw createHttpError(400, errors)
        }
        const { modelId, trimId, powertrainId, price, stock } = matchedData(req)
        res.send("POST new car config")
    },
]

exports.updateCarConfiguration = [
    param("modelId").isInt({ min: 0 }),
    body(["trimId", "powertrainId", "price", "stock"])
        .notEmpty()
        .isInt({ min: 0 }),
    (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw createHttpError(400, errors)
        }
        const { modelId, trimId, powertrainId, pric, stock } = matchedData(req)
        res.send("POST update car config")
    },
]

exports.deleteCarConfiguration = [
    param("modelId").isInt({ min: 0 }),
    body(["trimId", "powertrainId"]).notEmpty().isInt({ min: 0 }),
    (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw createHttpError(400, errors)
        }
        const { modelId, trimId, powertrainId } = matchedData(req)
        res.send("POST delete car config")
    },
]
