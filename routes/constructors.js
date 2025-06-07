var express = require("express")
const {
    getConstructor,
    getConstructors,
    getNewConstructor,
    postNewConstructor,
    postUpdateConstructor,
    deleteConstructor,
} = require("../controllers/constructorsController")
var router = express.Router()

router.get("/new", getNewConstructor)
router.post("/new", postNewConstructor)
router.get("/:id", getConstructor)
router.post("/:id", postUpdateConstructor)
router.delete("/:id", deleteConstructor)
router.get("/", getConstructors)

module.exports = router
