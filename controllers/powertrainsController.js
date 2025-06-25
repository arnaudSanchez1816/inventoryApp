const {
    param,
    body,
    validationResult,
    matchedData,
} = require("express-validator")
const createHttpError = require("http-errors")

//Validators
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

exports.postNewPowertrain = [
    powertrainBodyValidation(),
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw createHttpError(400, errors.array())
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
            throw createHttpError(400, errors.array())
        }
        const powertrainData = matchedData(req)
        console.log(powertrainData)

        res.send("POST update powertrain ")
    },
]

exports.deletePowertrain = [
    powertrainIdParamValidation(),
    param("id").isInt({ min: 0 }).toInt(),
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
