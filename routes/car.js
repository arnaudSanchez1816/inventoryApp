var express = require("express")
const { getCarModel } = require("../controllers/carController")
var router = express.Router()

router.get("/:id", getCarModel)

module.exports = router
