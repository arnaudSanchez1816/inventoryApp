var express = require("express")
const {
    getCarModel,
    getCarModels,
    getNewCarModel,
    postNewCarModel,
    postNewPowertrain,
    postUpdatePowertrain,
    deletePowertrain,
} = require("../controllers/carsController")
var router = express.Router()

// Powertrains
router.post("/:id/p", postNewPowertrain)
router.post("/:id/p/:powertrainId", postUpdatePowertrain)
router.delete("/:id/p/:powertrainId", deletePowertrain)
// models
router.get("/new", getNewCarModel)
router.post("/new", postNewCarModel)
router.get("/:id", getCarModel)
// All car models
router.get("/", getCarModels)

module.exports = router
