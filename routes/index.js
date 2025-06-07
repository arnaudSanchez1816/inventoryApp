var express = require("express")
var router = express.Router()
const db = require("../db/queries")

/* GET home page. */
router.get("/", async (req, res) => {
    const [carModels, constructors] = await Promise.all([
        db.getCarModels(),
        db.getConstructors(),
    ])

    res.render("index", {
        title: "Auto Inventory",
        models: carModels,
        constructors: constructors,
    })
})

module.exports = router
