var express = require("express")
const {
    getConstructor,
    getConstructors,
} = require("../controllers/constructorsController")
var router = express.Router()

router.get("/:id", getConstructor)
router.get("/", getConstructors)

module.exports = router
