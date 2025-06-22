var express = require("express")
const {
    postNewCarTrim,
    updateCarTrim: putUpdateCarTrim,
    deleteCarTrim,
} = require("../controllers/carsController")
var router = express.Router()

// Trims
router.post("/add", postNewCarTrim)
router.post("/edit/:trimId", putUpdateCarTrim)
router.post("/delete/:trimId", deleteCarTrim)

module.exports = router
