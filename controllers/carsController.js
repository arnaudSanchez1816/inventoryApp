const {
    param,
    validationResult,
    matchedData,
    body,
} = require("express-validator")
const createHttpError = require("http-errors")
const {
    getCarModels,
    getCarModelDetails,
    getCars,
    updateCarTrim,
    deleteCarTrim,
    addCarTrim,
} = require("../db/queries")

const carModelIdParamValidation = () => [param("id").isInt({ min: 0 }).toInt()]
const carModelIdBodyValidation = () => [
    body("modelId")
        .trim()
        .notEmpty()
        .withMessage("Trim model id is empty")
        .isInt({ min: 0 })
        .withMessage("Trim Model id is not valid")
        .toInt(),
]
const trimIdParamValidation = () => [param("trimId").isInt({ min: 0 }).toInt()]
const powertrainIdParamValidation = () => [
    param("powertrainId").isInt({ min: 0 }).toInt(),
]
const powertrainBodyValidation = () => [
    body("modelId")
        .trim()
        .notEmpty()
        .withMessage("Model id is empty")
        .isInt({ min: 0 })
        .withMessage("Model id is not valid")
        .toInt(),
    body("name")
        .trim()
        .notEmpty()
        .isString()
        .withMessage("Name field is empty"),
    body("engine-code")
        .trim()
        .notEmpty()
        .isString()
        .withMessage("Valid engine code required"),
    body("type")
        .trim()
        .notEmpty()
        .isString()
        .withMessage("Valid engine type required"),
    body("displacement")
        .trim()
        .notEmpty()
        .withMessage("Displacement value required")
        .isInt({ min: 0 })
        .withMessage("Displacement value is invalid")
        .toInt(),
    body("power")
        .trim()
        .notEmpty()
        .withMessage("Power value required")
        .isInt({ min: 0 })
        .withMessage("Power value is invalid")
        .toInt(),
    body("torque")
        .trim()
        .notEmpty()
        .withMessage("Torque value required")
        .isInt({ min: 0 })
        .withMessage("Torque value is invalid")
        .toInt(),
    body("configuration")
        .trim()
        .notEmpty()
        .withMessage("Engine configuration required")
        .isString()
        .withMessage("Engine configuration is invalid"),
    body("transmission")
        .trim()
        .notEmpty()
        .withMessage("Engine transmission type required")
        .isString()
        .withMessage("Engine transmission type is invalid"),
    body("drivetrain")
        .trim()
        .notEmpty()
        .withMessage("Engine drivetrain type required")
        .isString()
        .withMessage("Engine drivetrain type is invalid"),
    body("trims").trim().optional().isInt({ min: 0 }).toInt(),
]

const trimBodyValidation = () => [
    body("name").trim().isString(),
    body("modelId")
        .trim()
        .notEmpty()
        .withMessage("Trim model id is empty")
        .isInt({ min: 0 })
        .withMessage("Trim Model id is not valid")
        .toInt(),
]

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

exports.postNewPowertrain = [
    powertrainBodyValidation(),
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const errorMap = errors.mapped()
            throw createHttpError(400, errors)
        }
        try {
            const powertrainData = matchedData(req)
            console.log(powertrainData)

            res.send("POST create powertrain ")
        } catch (error) {
            throw createHttpError(500, error.message)
        }
    },
]

exports.updatePowertrain = [
    powertrainIdParamValidation(),
    powertrainBodyValidation(),
    (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const errorMap = errors.mapped()
            throw createHttpError(400, errors)
        }
        const powertrainData = matchedData(req)
        console.log(powertrainData)

        res.send("POST update powertrain ")
    },
]

exports.deletePowertrain = [
    powertrainIdParamValidation(),
    carModelIdBodyValidation(),
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
    trimBodyValidation(),
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const errorMap = errors.mapped()
            if (errorMap.modelId) {
                throw createHttpError(404, "Car model not found")
            }
            throw createHttpError(400, errors)
        }
        const { modelId, name } = matchedData(req)
        try {
            await addCarTrim(modelId, name)
            res.redirect(`/cars/${modelId}`)
        } catch (error) {
            throw createHttpError(500, error.message)
        }
    },
]

exports.updateCarTrim = [
    trimIdParamValidation(),
    trimBodyValidation(),
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const errorMap = errors.mapped()
            if (errorMap.modelId) {
                throw createHttpError(404, "Car model not found")
            }
            if (errorMap.trimId) {
                throw createHttpError(404, "Trim id not found")
            }
            throw createHttpError(400, errors)
        }
        try {
            const { modelId, trimId, name } = matchedData(req)
            await updateCarTrim(trimId, name)

            res.redirect(`/cars/${modelId}`)
        } catch (error) {
            throw createHttpError(500, error.message)
        }
    },
]

exports.deleteCarTrim = [
    trimIdParamValidation(),
    carModelIdBodyValidation(),
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const errorMap = errors.mapped()
            if (errorMap.modelId) {
                throw createHttpError(404, "Car model not found")
            }
            throw createHttpError(404, "Trim id not found")
        }

        try {
            const { modelId, trimId } = matchedData(req)
            await deleteCarTrim(trimId)
            res.redirect(`/cars/${modelId}`)
        } catch (error) {
            throw createHttpError(500, error.message)
        }
    },
]
