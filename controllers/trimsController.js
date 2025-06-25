const {
    param,
    body,
    validationResult,
    matchedData,
} = require("express-validator")
const createHttpError = require("http-errors")
const { updateCarTrim, deleteCarTrim, addCarTrim } = require("../db/queries")

// Validators
const trimIdParamValidation = () => [param("trimId").isInt({ min: 0 }).toInt()]
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
const carModelIdBodyValidation = () => [
    body("modelId")
        .trim()
        .notEmpty()
        .withMessage("Trim model id is empty")
        .isInt({ min: 0 })
        .withMessage("Trim Model id is not valid")
        .toInt(),
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
