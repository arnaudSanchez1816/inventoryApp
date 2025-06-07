var express = require("express")
const {
    getConstructor,
    getConstructors,
} = require("../controllers/constructorController")
var router = express.Router()

router.get("/:id", getConstructor)
router.get("/", getConstructors)

module.exports = router
