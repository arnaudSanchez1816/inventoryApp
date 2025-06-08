const {
    param,
    validationResult,
    matchedData,
    body,
} = require("express-validator")
const createHttpError = require("http-errors")
const { getCarModels, getCarModelDetails, getCars } = require("../db/queries")

const carModelIdParamValidation = [param("id").isInt({ min: 0 })]
const trimIdParamValidation = [param("trimId").isInt({ min: 0 })]
const powertrainIdParamValidation = [param("powertrainId").isInt({ min: 0 })]
const powertrainBodyValidation = [
    body("name")
        .trim()
        .isString()
        .notEmpty()
        .withMessage("Name field is empty"),
]

const trimBodyValidation = [
    body("name")
        .trim()
        .isString()
        .notEmpty()
        .withMessage("Name field is empty"),
]

exports.getCarModel = [
    carModelIdParamValidation,
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

exports.postNewPowertrain = [
    carModelIdParamValidation,
    powertrainBodyValidation,
    (req, res) => {
        res.send("POST new car powertrain")
    },
]

exports.postUpdatePowertrain = [
    carModelIdParamValidation,
    powertrainIdParamValidation,
    powertrainBodyValidation,
    (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const errorMap = errors.mapped()
            if (errorMap.id) {
                throw createHttpError(404, "Car model not found")
            }
            if (errorMap.powertrainId) {
                throw createHttpError(404, "Powertrain id not found")
            }
            throw createHttpError(400, errors)
        }
        const { id, powertrainId, name } = matchedData(req)
        res.send("POST update powertrain ")
    },
]

exports.deletePowertrain = [
    carModelIdParamValidation,
    powertrainIdParamValidation,
    (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const errorMap = errors.mapped()
            if (errorMap.id) {
                throw createHttpError(404, "Car model not found")
            }
            throw createHttpError(404, "Powertrain id not found")
        }

        const { id, trimId: powertrainId } = matchedData(req)
        res.send(
            `POST delete powertrain\ncar model ${id}\npowertrain ${powertrainId}`
        )
    },
]

exports.postNewCarTrim = [
    carModelIdParamValidation,
    trimBodyValidation,
    (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const errorMap = errors.mapped()
            if (errorMap.id) {
                throw createHttpError(404, "Car model not found")
            }
            throw createHttpError(400, errors)
        }
        const { id, name } = matchedData(req)
        res.send("POST new car trim")
    },
]

exports.postUpdateCarTrim = [
    carModelIdParamValidation,
    trimIdParamValidation,
    trimBodyValidation,
    (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const errorMap = errors.mapped()
            if (errorMap.id) {
                throw createHttpError(404, "Car model not found")
            }
            if (errorMap.trimId) {
                throw createHttpError(404, "Trim id not found")
            }
            throw createHttpError(400, errors)
        }
        const { id, trimId, name } = matchedData(req)
        res.send("POST update car trim")
    },
]

exports.deleteCarTrim = [
    carModelIdParamValidation,
    trimIdParamValidation,
    (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const errorMap = errors.mapped()
            if (errorMap.id) {
                throw createHttpError(404, "Car model not found")
            }
            throw createHttpError(404, "Trim id not found")
        }

        const { id, trimId } = matchedData(req)
        res.send(`POST delete car trim\ncar model ${id}\ntrim ${trimId}`)
    },
]
