var express = require("express")
const {
    postNewPowertrain,
    updatePowertrain,
    deletePowertrain,
} = require("../controllers/powertrainsController")
const { validatePassword } = require("../middlewares/passwordValidation")
var router = express.Router()

router.use(validatePassword)
// Powertrains
router.post("/add", postNewPowertrain)
router.post("/edit/:powertrainId", updatePowertrain)
router.post("/delete/:powertrainId", deletePowertrain)

module.exports = router
