var express = require("express")
var router = express.Router()
const db = require("../db/queries")
const { query, validationResult, matchedData } = require("express-validator")
const createHttpError = require("http-errors")

const searchQueryValidation = [query("q").trim().isString().escape()]

router.get("/", [
    searchQueryValidation,
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw createHttpError(400, "Invalid search query")
        }

        const { q } = matchedData(req)

        const [carModels, constructors] = await Promise.all([
            db.searchCarModels(q),
            db.searchConstructors(q),
        ])

        res.render("search", {
            title: "Auto Inventory",
            query: q,
            models: carModels,
            constructors: constructors,
        })
    },
])

module.exports = router
