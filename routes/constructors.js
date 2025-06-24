var express = require("express")
const {
    getConstructor,
    getConstructors,
    postNewConstructor,
    postUpdateConstructor,
    deleteConstructor,
} = require("../controllers/constructorsController.js")
var router = express.Router()

router.post("/new", postNewConstructor)
router.post("/:id/update", postUpdateConstructor)
router.post("/:id/delete", deleteConstructor)
router.get("/:id", getConstructor)
router.get("/", getConstructors)

module.exports = router
