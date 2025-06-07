var express = require("express")
const {
    getCarModel,
    getCarModels,
    getNewCarModel,
    postNewCarModel,
    postNewPowertrain,
    postNewCarTrim,
    postUpdateCarTrim,
    deleteCarTrim,
    postUpdatePowertrain,
    deletePowertrain,
} = require("../controllers/carsController")
var router = express.Router()

// Powertrains
router.post("/:id/p", postNewPowertrain)
router.post("/:id/p/:powertrainId", postUpdatePowertrain)
router.delete("/:id/p/:powertrainId", deletePowertrain)
// Trims
router.post("/:id/t", postNewCarTrim)
router.post("/:id/t/:trimId", postUpdateCarTrim)
router.delete("/:id/t/:trimId", deleteCarTrim)
// models
router.get("/new", getNewCarModel)
router.post("/new", postNewCarModel)
router.get("/:id", getCarModel)
// All car models
router.get("/", getCarModels)

module.exports = router
