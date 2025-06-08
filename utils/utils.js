const path = require("path")

exports.convertConstructorLogoPath = (constructor) => {
    if (constructor.logo_path.includes(process.env.CONSTRUCTORS_IMAGE_PATH)) {
        return constructor
    }

    constructor.logo_path = path.join(
        process.env.CONSTRUCTORS_IMAGE_PATH,
        constructor.logo_path
    )

    return constructor
}
