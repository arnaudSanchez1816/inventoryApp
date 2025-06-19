class Dialog {
    #dialog
    #title
    #generateContentCb

    constructor(title, generateContentCb) {
        this.#title = title
        this.#generateContentCb = generateContentCb
    }

    show() {
        if (this.#dialog) {
            console.error("Modal already displayed !")
            return
        }

        this.#dialog = document.createElement("dialog")
        this.#dialog.classList = ["overlay"]

        this.#dialog.addEventListener("click", this.#onBackdropClick)

        const modal = document.createElement("div")
        modal.classList = ["overlay-modal"]
        this.#dialog.appendChild(modal)

        // Header
        const header = this.#createHeader()
        modal.appendChild(header)
        // Content
        const content = document.createElement("div")
        content.classList = ["overlay-content"]
        const generatedContent = this.#generateContentCb(this)
        if (generatedContent) {
            content.appendChild(generatedContent)
        }
        modal.appendChild(content)

        const body = document.body
        body.appendChild(this.#dialog)
        this.#dialog.showModal()
    }

    hide() {
        if (this.#dialog) {
            this.#dialog.removeEventListener("click", this.#onBackdropClick)
            const body = document.body
            this.#dialog.close()
            body.removeChild(this.#dialog)
            this.#dialog = null
        }
    }

    #createHeader() {
        const header = document.createElement("header")
        header.classList = ["overlay-header"]

        const title = document.createElement("span")
        title.classList = ["overlay-title"]
        title.textContent = this.#title

        const closeButton = document.createElement("button")
        closeButton.classList.add("overlay-close-button")
        closeButton.textContent = "Close"
        const closeCb = () => {
            closeButton.removeEventListener("click", closeCb)
            this.hide()
        }
        closeButton.addEventListener("click", closeCb)

        header.appendChild(title)
        header.appendChild(closeButton)

        return header
    }

    #onBackdropClick = (e) => {
        const dialogDimensions = this.#dialog.getBoundingClientRect()
        if (
            e.clientX < dialogDimensions.left ||
            e.clientX > dialogDimensions.right ||
            e.clientY < dialogDimensions.top ||
            e.clientY > dialogDimensions.bottom
        ) {
            this.hide()
        }
    }
}

export default Dialog
