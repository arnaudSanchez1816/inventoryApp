var express = require("express")
const {
    getCarModel,
    getCarModels,
    getNewCarModel,
    postNewCarModel,
    addNewCarConfiguration,
} = require("../controllers/carsController")
var router = express.Router()

// configs
router.post("/:modelId/config/new", addNewCarConfiguration)

// models
router.get("/new", getNewCarModel)
router.post("/new", postNewCarModel)
router.get("/:id", getCarModel)

// All car models
router.get("/", getCarModels)

module.exports = router
