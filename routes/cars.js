var express = require("express")
const {
    getCarModel,
    getCarModels,
    getNewCarModel,
    postNewCarModel,
} = require("../controllers/carsController")
var router = express.Router()

// models
router.get("/new", getNewCarModel)
router.post("/new", postNewCarModel)
router.get("/:id", getCarModel)
// All car models
router.get("/", getCarModels)

module.exports = router
