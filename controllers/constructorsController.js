const {
    param,
    validationResult,
    matchedData,
    body,
} = require("express-validator")
const { getConstructorDetails, getConstructors } = require("../db/queries")
const createHttpError = require("http-errors")
const db = require("../db/queries")
const multer = require("multer")
const path = require("path")
const fs = require("fs/promises")
const { validatePassword } = require("../middlewares/passwordValidation")

const MAX_FILE_SIZE = 2000000 // 2 MB
const LOGO_FILE_TYPES = ["image/jpeg", "image/png", "image/svg+xml"]

const constructorIdParamValidation = () => [param("id").isInt({ min: 0 })]
const constructorBodyValidation = () => [
    body(["name", "country"])
        .trim()
        .notEmpty()
        .withMessage("Field is empty")
        .isString()
        .withMessage("Field must be a string"),
]

const constructorLogoMiddleware = () =>
    multer({
        storage: multer.memoryStorage(),
        limits: { files: 1, fileSize: MAX_FILE_SIZE },
    }).single("logo")

exports.getConstructor = [
    constructorIdParamValidation(),
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
    const constructors = await getConstructors({ sortBy: "name", order: "Asc" })

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
    constructorLogoMiddleware(),
    validatePassword,
    constructorBodyValidation(),
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw createHttpError(400, errors.array())
        }
        const file = req.file
        if (!file) {
            throw createHttpError(400, "Logo file missing")
        }
        if (!LOGO_FILE_TYPES.includes(file.mimetype)) {
            throw createHttpError(400, "Invalid file type")
        }

        try {
            const extension = path.extname(file.originalname)
            const { name, country } = matchedData(req)

            const constructorId = await db.addConstructor({
                name: name,
                country: country,
                logoFileExtension: extension,
            })

            const logoPath = `${constructorId}${extension}`
            await fs.writeFile(
                `./public/images/constructors/${logoPath}`,
                file.buffer
            )
            res.redirect(`/constructors/${constructorId}`)
        } catch (error) {
            throw createHttpError(500, error)
        }
    },
]

exports.postUpdateConstructor = [
    constructorLogoMiddleware(),
    validatePassword,
    constructorIdParamValidation(),
    constructorBodyValidation(),
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw createHttpError(400, errors.array())
        }

        const file = req.file
        if (file && !LOGO_FILE_TYPES.includes(file.mimetype)) {
            throw createHttpError(400, "Invalid file type")
        }

        try {
            const { id, name, country } = matchedData(req)
            const constructorData = { id, name, country }
            if (file) {
                const extension = path.extname(file.originalname)
                const logoPath = `${id}${extension}`
                constructorData.logoPath = logoPath
            }

            await db.updateConstructor(constructorData)

            if (file) {
                await fs.writeFile(
                    `./public/images/constructors/${constructorData.logoPath}`,
                    file.buffer
                )
            }

            res.redirect(`/constructors/${id}`)
        } catch (error) {
            throw createHttpError(500, error)
        }
    },
]

exports.deleteConstructor = [
    validatePassword,
    constructorIdParamValidation(),
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw createHttpError(404, errors.array())
        }

        try {
            const { id } = matchedData(req)
            await db.deleteConstructor(id)
            res.redirect("/")
        } catch (error) {
            throw createHttpError(500, error.message)
        }
    },
]
