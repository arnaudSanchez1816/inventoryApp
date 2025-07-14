const path = require("path")

exports.convertConstructorLogoPath = (constructor) => {
    if (constructor.logoPath.includes(process.env.CONSTRUCTORS_IMAGE_PATH)) {
        return constructor
    }

    constructor.logoPath = this.logoFilenameToLogoPath(constructor.logoPath)

    return constructor
}

exports.logoFilenameToLogoPath = (filename) => {
    return path.join(process.env.CONSTRUCTORS_IMAGE_PATH, filename)
}
