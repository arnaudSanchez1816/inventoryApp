import Dialog from "./modal.js"

function addTrimDialogContent() {
    const container = document.createElement("div")

    const helloWorld = document.createElement("p")
    helloWorld.textContent = "Hello world !"
    container.appendChild(helloWorld)

    return container
}

function showEditTrimDialog({ id, modelId, name }) {
    const editDialog = new Dialog("Edit trim", (dialog) => {
        const container = document.createElement("div")

        const updateForm = document.createElement("form")
        updateForm.method = "post"
        updateForm.action = `/cars/${modelId}/t/${id}`

        const nameLabel = document.createElement("label")
        nameLabel.textContent = "Name"
        const nameInput = document.createElement("input")
        nameInput.name = "name"
        nameInput.value = name
        nameLabel.appendChild(nameInput)

        const submitButton = document.createElement("button")
        submitButton.textContent = "Submit"

        updateForm.appendChild(nameLabel)
        updateForm.appendChild(submitButton)
        updateForm.addEventListener("submit", (e) => {
            e.preventDefault()
            e.target.submit()
            setTimeout(() => dialog.hide())
        })

        container.appendChild(updateForm)

        return container
    })

    editDialog.show()
}

function showDeleteTrimDialog({ id, modelId, name }) {
    const deleteDialog = new Dialog("Delete trim", (dialog) => {
        const container = document.createElement("div")

        const deleteForm = document.createElement("form")
        deleteForm.method = "post"
        deleteForm.action = `/cars/${modelId}/t/${id}`

        const trimName = document.createElement("h1")
        trimName.textContent = name
        container.appendChild(trimName)

        const deleteConfirmInstructions = document.createElement("p")
        deleteConfirmInstructions.textContent =
            'Enter "Delete" in the below field to confirm deletion'
        container.appendChild(deleteConfirmInstructions)

        const confirmLabel = document.createElement("label")
        confirmLabel.textContent = "Confirmation"
        const confirmInput = document.createElement("input")
        confirmInput.value = ""
        confirmLabel.appendChild(confirmInput)

        const submitButton = document.createElement("button")
        submitButton.textContent = "Delete"

        deleteForm.appendChild(confirmLabel)
        deleteForm.appendChild(submitButton)
        deleteForm.addEventListener("submit", (e) => {
            e.preventDefault()

            confirmInput.setCustomValidity("")

            const confirmInputValue = confirmInput.value
            if (confirmInputValue !== "Delete") {
                console.log("hello")
                confirmInput.setCustomValidity(
                    'Enter "Delete" to confirm deletion'
                )
                return
            }

            e.target.submit()
            setTimeout(() => dialog.hide())
        })

        container.appendChild(deleteForm)

        return container
    })

    deleteDialog.show()
}

export { addTrimDialogContent, showEditTrimDialog, showDeleteTrimDialog }
