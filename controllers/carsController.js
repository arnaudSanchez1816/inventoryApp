const {
    param,
    validationResult,
    matchedData,
    body,
} = require("express-validator")
const createHttpError = require("http-errors")
const {
    getCarModelDetails,
    getConfigurations,
    addCarModel,
    deleteCarModel,
    updateCarModel,
    getCarModels,
    addNewConfiguration,
    updateConfiguration,
    deleteConfiguration,
} = require("../db/queries")

//Validators
const carModelIdParamValidation = () => [
    param("modelId").isInt({ min: 0 }).toInt(),
]

exports.getCarModel = [
    carModelIdParamValidation(),
    async (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return next()
        }
        const { modelId } = matchedData(req)

        const [modelDetails, modelCars] = await Promise.all([
            getCarModelDetails(modelId),
            getConfigurations(modelId),
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
        try {
            const cars = await getCarModels({ sortBy: "name", order: "asc" })

            const carsMap = {}
            cars.forEach((c) => {
                const initial = c.name.toUpperCase()[0]
                let mapKey = "#"
                if (initial.match(/[A-Z]/)) {
                    mapKey = initial
                }
                if (!carsMap[mapKey]) {
                    carsMap[mapKey] = []
                }

                carsMap[mapKey].push(c)
            })

            res.render("cars", {
                cars: carsMap,
            })
        } catch (error) {
            throw createHttpError(500, error.message)
        }
    },
]

exports.postNewCarModel = [
    [
        body("name")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Name is empty")
            .isString()
            .withMessage("Name is not a string"),
        body("year")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Year is empty")
            .isInt({ allow_leading_zeroes: false, min: 1, max: 9999 })
            .withMessage("Year is not valid")
            .toInt(),
        body("constructorId")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Constructor id is empty")
            .isInt({ min: 0 })
            .withMessage("Constructor id is invalid")
            .toInt(),
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw createHttpError(400, errors.array())
        }
        try {
            const data = matchedData(req)
            const modelId = await addCarModel(data)
            res.redirect(`/cars/${modelId}`)
        } catch (error) {
            throw createHttpError(500, error.message)
        }
    },
]

exports.updateCarModel = [
    carModelIdParamValidation(),
    [
        body("name")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Name is empty")
            .isString()
            .withMessage("Name is not a string"),
        body("year")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Year is empty")
            .isDate({ format: "YYYY" })
            .withMessage("Year is not a valid date")
            .toInt(),
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw createHttpError(400, errors.array())
        }
        try {
            const data = matchedData(req)
            const { modelId } = data
            await updateCarModel(data)
            res.redirect(`/cars/${modelId}`)
        } catch (error) {
            throw createHttpError(500, error.message)
        }
    },
]

exports.deleteCarModel = [
    carModelIdParamValidation(),
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw createHttpError(400, errors.array())
        }
        try {
            const { modelId } = matchedData(req)
            await deleteCarModel({ modelId })
            res.send("/")
        } catch (error) {
            throw createHttpError(500, error.message)
        }
    },
]

// Configs
exports.addNewCarConfiguration = [
    param("modelId").isInt({ min: 0 }),
    body(["trimId", "powertrainId", "price", "stock"])
        .notEmpty()
        .isInt({ min: 0 }),
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw createHttpError(400, errors)
        }
        try {
            const queryData = matchedData(req)
            await addNewConfiguration(queryData)
            const { modelId } = queryData
            res.redirect(`/cars/${modelId}`)
        } catch (error) {
            throw createHttpError(500, error.message)
        }
    },
]

exports.updateCarConfiguration = [
    param("modelId").isInt({ min: 0 }),
    body(["trimId", "powertrainId", "price", "stock"])
        .notEmpty()
        .isInt({ min: 0 }),
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw createHttpError(400, errors)
        }
        try {
            const queryData = matchedData(req)
            await updateConfiguration(queryData)
            const { modelId } = queryData
            res.redirect(`/cars/${modelId}`)
        } catch (error) {
            throw createHttpError(500, error.message)
        }
    },
]

exports.deleteCarConfiguration = [
    param("modelId").isInt({ min: 0 }),
    body(["trimId", "powertrainId"]).notEmpty().isInt({ min: 0 }),
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw createHttpError(400, errors)
        }
        try {
            const queryData = matchedData(req)
            await deleteConfiguration(queryData)
            const { modelId } = queryData
            res.redirect(`/cars/${modelId}`)
        } catch (error) {
            throw createHttpError(500, error.message)
        }
    },
]
