var express = require("express")
var router = express.Router()
const db = require("../db/queries")

/* GET home page. */
router.get("/", async (req, res) => {
    const [carModels, constructors] = await Promise.all([
        db.getCarModels({ sortBy: "id", order: "DESC", nbItems: 5 }),
        db.getConstructors({ sortBy: "id", order: "DESC", nbItems: 5 }),
    ])

    res.render("index", {
        title: "Auto Inventory",
        models: carModels,
        constructors: constructors,
    })
})

module.exports = router
