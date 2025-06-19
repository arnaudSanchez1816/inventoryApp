const path = require("path")

exports.convertConstructorLogoPath = (constructor) => {
    if (constructor.logoPath.includes(process.env.CONSTRUCTORS_IMAGE_PATH)) {
        return constructor
    }

    constructor.logoPath = path.join(
        process.env.CONSTRUCTORS_IMAGE_PATH,
        constructor.logoPath
    )

    return constructor
}
