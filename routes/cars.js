var express = require("express")
const { getCarModel, getCarModels } = require("../controllers/carsController")
var router = express.Router()

router.get("/:id", getCarModel)
router.get("/", getCarModels)

module.exports = router
