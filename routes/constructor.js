var express = require("express")
const { getConstructor } = require("../controllers/constructorController")
var router = express.Router()

router.get("/:id", getConstructor)

module.exports = router
