var express = require("express")
const {
    getCarModel,
    getCarModels,
    getNewCarModel,
    postNewCarModel,
    postNewCarPowertrain,
    postNewCarTrim,
} = require("../controllers/carsController")
var router = express.Router()

router.get("/new", getNewCarModel)
router.post("/new", postNewCarModel)
router.get("/:id", getCarModel)
router.post("/:id/newP", postNewCarPowertrain)
router.post("/:id/newT", postNewCarTrim)
router.post("/:id/p/:pId", null)
router.delete("/:id/p/:pId", null)
router.post("/:id/t/:pId", null)
router.delete("/:id/t/:pId", null)
router.get("/", getCarModels)

module.exports = router
