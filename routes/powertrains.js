var express = require("express")
const {
    postNewPowertrain,
    updatePowertrain,
    deletePowertrain,
} = require("../controllers/carsController")
var router = express.Router()

// Powertrains
router.post("/add", postNewPowertrain)
router.post("/edit/:powertrainId", updatePowertrain)
router.post("/delete/:powertrainId", deletePowertrain)

module.exports = router
