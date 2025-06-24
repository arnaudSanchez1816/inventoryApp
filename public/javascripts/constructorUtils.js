const fileTypes = ["image/jpeg", "image/png", "image/svg+xml"]
const maxFileSize = 2000000 // 2 MB

function validFileType(file) {
    return fileTypes.includes(file.type)
}

class ConstructorLogoInput {
    logoInput
    errorP
    logoPreview

    constructor(inputContainer) {
        this.logoInput = inputContainer.querySelector(".logo-input")
        this.logoPreview = inputContainer.querySelector(".logo-preview")
        this.errorP = inputContainer.querySelector(".logo-error")
        this.logoInput.addEventListener("change", this.#onLogoInputChanged)
    }

    #onLogoInputChanged = () => {
        this.logoInput.setCustomValidity("")
        this.errorP.textContent = ""

        this.logoPreview.classList.remove("hidden")
        const files = this.logoInput.files
        if (files.length != 1) {
            this.logoPreview.src = ""
            this.logoPreview.classList.add("hidden")
            if (files.length > 1) {
                this.errorP.textContent = "Maximum 1 image"
            }
            return
        }

        const file = files[0]
        if (validFileType(file) === false) {
            this.errorP.textContent =
                "Invalid image type (Accepted types : PNG, JPG, SVG)"
            return
        }

        if (file.size > maxFileSize) {
            this.errorP.textContent = "Invalid file size (Max : 2 MB)"
        }

        const sourceUrl = URL.createObjectURL(file)
        this.logoPreview.src = sourceUrl
    }
}

const onConstructorFormSubmit = (e, input) => {
    const logoInput = input.logoInput
    const errorP = input.errorP
    logoInput.setCustomValidity("")

    const files = logoInput.logoInput.files
    if (files.length < 1) {
        logoInput.logoInput.setCustomValidity("Image file required")
        e.preventDefault()
        return
    }

    if (errorP.textContent !== "") {
        logoInput.logoInput.setCustomValidity("Invalid image file")
        e.preventDefault()
        return
    }
}

export { ConstructorLogoInput, onConstructorFormSubmit }
