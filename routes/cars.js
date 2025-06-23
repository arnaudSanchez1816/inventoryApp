var express = require("express")
const {
    getCarModel,
    getCarModels,
    getNewCarModel,
    postNewCarModel,
    addNewCarConfiguration,
    updateCarConfiguration,
    deleteCarConfiguration,
} = require("../controllers/carsController")
var router = express.Router()

// configs
router.post("/:modelId/config/new", addNewCarConfiguration)
router.post("/:modelId/config/update", updateCarConfiguration)
router.post("/:modelId/config/delete", deleteCarConfiguration)

// models
router.get("/new", getNewCarModel)
router.post("/new", postNewCarModel)
router.get("/:id", getCarModel)

// All car models
router.get("/", getCarModels)

module.exports = router
