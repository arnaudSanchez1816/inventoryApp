var express = require("express")
const {
    getCarModel,
    postNewCarModel,
    addNewCarConfiguration,
    updateCarConfiguration,
    deleteCarConfiguration,
    deleteCarModel,
    updateCarModel,
} = require("../controllers/carsController")
const { validatePassword } = require("../middlewares/passwordValidation")
var router = express.Router()

router.post("/*splat", validatePassword)
// configs
router.post("/:modelId/config/new", addNewCarConfiguration)
router.post("/:modelId/config/update", updateCarConfiguration)
router.post("/:modelId/config/delete", deleteCarConfiguration)

// models
router.post("/new", postNewCarModel)
router.post("/:modelId/delete", deleteCarModel)
router.post("/:modelId/update", updateCarModel)
router.get("/:modelId", getCarModel)

module.exports = router
