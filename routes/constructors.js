var express = require("express")
const {
    getConstructor,
    getConstructors,
    getNewConstructor,
    postNewConstructor,
} = require("../controllers/constructorsController")
var router = express.Router()

router.get("/new", getNewConstructor)
router.post("/new", postNewConstructor)
router.get("/:id", getConstructor)
router.get("/", getConstructors)

module.exports = router
