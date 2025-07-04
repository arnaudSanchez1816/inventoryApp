class DeleteForm {
    formElement
    constructor(formElement) {
        this.formElement = formElement
        if (formElement) {
            formElement.addEventListener("submit", this.#onFormSubmit)
            const deleteInput = formElement.querySelector("input.delete")
            if (deleteInput) {
                deleteInput.addEventListener("input", () =>
                    deleteInput.setCustomValidity("")
                )
            }
        }
    }

    #onFormSubmit = (e) => {
        const confirmInput = e.target.querySelector("input.delete")

        const confirmInputValue = confirmInput.value
        if (confirmInputValue !== "Delete") {
            e.preventDefault()
            confirmInput.setCustomValidity('Enter "Delete" to confirm deletion')
            confirmInput.reportValidity()
            return
        }
    }
}

export default DeleteForm
