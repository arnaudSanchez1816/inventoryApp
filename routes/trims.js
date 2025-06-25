var express = require("express")
const {
    postNewCarTrim,
    updateCarTrim,
    deleteCarTrim,
} = require("../controllers/trimsController")
var router = express.Router()

// Trims
router.post("/add", postNewCarTrim)
router.post("/edit/:trimId", updateCarTrim)
router.post("/delete/:trimId", deleteCarTrim)

module.exports = router
