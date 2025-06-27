var express = require("express")
const {
    postNewCarTrim,
    updateCarTrim,
    deleteCarTrim,
} = require("../controllers/trimsController")
const { validatePassword } = require("../middlewares/passwordValidation")
var router = express.Router()

router.use(validatePassword)
// Trims
router.post("/add", postNewCarTrim)
router.post("/edit/:trimId", updateCarTrim)
router.post("/delete/:trimId", deleteCarTrim)

module.exports = router
