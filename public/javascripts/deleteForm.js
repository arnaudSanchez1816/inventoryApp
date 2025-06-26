class DeleteForm {
    formElement
    constructor(formElement) {
        this.formElement = formElement
        if (formElement) {
            formElement.addEventListener("submit", this.#onFormSubmit)
        }
    }

    #onFormSubmit = (e) => {
        const confirmInput = e.target.querySelector("input.delete")
        confirmInput.setCustomValidity("")

        const confirmInputValue = confirmInput.value
        if (confirmInputValue !== "Delete") {
            confirmInput.setCustomValidity('Enter "Delete" to confirm deletion')
            e.preventDefault()
            return
        }
    }
}

export default DeleteForm
