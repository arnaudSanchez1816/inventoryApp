require("dotenv").config()
var createError = require("http-errors")
var express = require("express")
var path = require("path")
var cookieParser = require("cookie-parser")
var logger = require("morgan")
var debug = require("debug")("inventoryapp:server")
const fs = require("fs/promises")

// Set PERSISTENT_DATA_PATH default value to /public directory if needed
if (!process.env.PERSISTENT_DATA_PATH) {
    const dataPath = path.join(__dirname, "public")
    console.log(`Set PERSISTENT_DATA_PATH to ${dataPath}`)
    process.env.PERSISTENT_DATA_PATH = dataPath
}

var indexRouter = require("./routes/index")
var constructorsRouter = require("./routes/constructors")
var carsRouter = require("./routes/cars")
var searchRouter = require("./routes/search")
var trimsRouter = require("./routes/trims")
var powertrainsRouter = require("./routes/powertrains")
const { logoFilenameToLogoPath } = require("./utils/utils")

var app = express()

// view engine setup
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
// Custom static file serving for constructors logo, they are served from a persistent
// mounted disk outside /public to keep data between deployment in production
app.get(
    `${process.env.CONSTRUCTORS_IMAGE_PATH}:location`,
    async function (req, res, next) {
        const location = req.params.location
        const imagePath = path.join(
            process.env.PERSISTENT_DATA_PATH,
            logoFilenameToLogoPath(location)
        )
        try {
            await fs.access(imagePath)
            res.sendFile(imagePath)
        } catch (error) {
            debug(error)
            next()
        }
    }
)
app.use(express.static(path.join(__dirname, "public")))

app.use("/", indexRouter)
app.use("/constructors", constructorsRouter)
app.use("/cars", carsRouter)
app.use("/powertrains", powertrainsRouter)
app.use("/trims", trimsRouter)
app.use("/s", searchRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404))
})

// error handler
// eslint-disable-next-line
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.status = err.status || 500
    res.locals.error = req.app.get("env") === "development" ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render("error")
    debug("%O", err)
})

module.exports = app
