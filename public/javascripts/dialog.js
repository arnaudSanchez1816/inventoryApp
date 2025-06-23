class Dialog {
    #dialog

    constructor(dialogSelector) {
        let dialogElement = dialogSelector
        if (dialogSelector != false && typeof dialogSelector === "string") {
            dialogElement = document.querySelector(dialogSelector)
            if (
                !dialogElement ||
                dialogElement.nodeName.toLowerCase() !== "dialog"
            ) {
                throw new Error(
                    `Could not find the dialog matching selector : ${dialogSelector}`
                )
            }
        }

        this.#dialog = dialogElement
        const dialog = this.#dialog
        if (!dialog || dialog instanceof HTMLDialogElement == false) {
            throw new Error("Dialog element is invalid.")
        }
        const closeButtons = dialog.querySelectorAll("button.close")

        closeButtons.forEach((closeBtn) =>
            closeBtn.addEventListener("click", () => this.hide())
        )
        dialog.addEventListener("mousedown", this.#onBackdropClick)
    }

    get dialog() {
        return this.#dialog
    }

    show() {
        const dialog = this.#dialog
        if (dialog.open) {
            console.error("Dialog already open")
            return
        }

        dialog.showModal()
    }

    hide() {
        if (this.#dialog.open == false) {
            return
        }

        this.#dialog.close()
    }

    #onBackdropClick = (e) => {
        if (e.target !== e.currentTarget) {
            return
        }

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
