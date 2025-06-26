import Dialog from "./dialog.js"

const trims = document.querySelectorAll(".trim-item")
trims.forEach((trim) => {
    const editTrimDialog = new Dialog(trim.querySelector(`.edit-trim-dialog`))

    const editBtn = trim.querySelector(".edit")

    editBtn.addEventListener("click", () => editTrimDialog.show())

    const deleteTrimDialog = new Dialog(
        trim.querySelector(`.delete-trim-dialog`)
    )
    const onDeleteTrimSubmitted = (e) => {
        e.preventDefault()
        const confirmInput = e.target.querySelector("input.delete")
        confirmInput.setCustomValidity("")

        const confirmInputValue = confirmInput.value
        if (confirmInputValue !== "Delete") {
            confirmInput.setCustomValidity('Enter "Delete" to confirm deletion')
            return
        }
        e.target.submit()
    }
    const deleteForm = deleteTrimDialog.dialog.querySelector("form")
    deleteForm.addEventListener("submit", onDeleteTrimSubmitted)
    const deleteBtn = trim.querySelector(".delete")
    deleteBtn.addEventListener("click", () => deleteTrimDialog.show())
})

const addTrimDialog = new Dialog("#add-trim-dialog")
const addTrimBtn = document.querySelector("#add-trim-btn")
addTrimBtn.addEventListener("click", () => addTrimDialog.show())

// Powertrains
const addPowertrainDialog = new Dialog("#add-powertrain-dialog")
const addPowertrainBtn = document.querySelector("#add-powertrain-btn")
addPowertrainBtn.addEventListener("click", () => addPowertrainDialog.show())

const powertrains = document.querySelectorAll(".powertrain-item")
powertrains.forEach((powertrain) => {
    const id = powertrain.dataset.ptId
    const editPtDialog = new Dialog(`.edit-pt-dialog[data-pt-id="${id}"]`)

    const editBtn = powertrain.querySelector(".edit")

    editBtn.addEventListener("click", () => editPtDialog.show())

    const deletePtDialog = new Dialog(`.delete-pt-dialog[data-pt-id="${id}"]`)
    const onDeletePtSubmitted = (e) => {
        e.preventDefault()
        const confirmInput = e.target.querySelector("input.delete")
        confirmInput.setCustomValidity("")

        const confirmInputValue = confirmInput.value
        if (confirmInputValue !== "Delete") {
            confirmInput.setCustomValidity('Enter "Delete" to confirm deletion')
            return
        }
        e.target.submit()
    }
    const deleteForm = deletePtDialog.dialog.querySelector("form")
    deleteForm.addEventListener("submit", onDeletePtSubmitted)
    const deleteBtn = powertrain.querySelector(".delete")
    deleteBtn.addEventListener("click", () => deletePtDialog.show())
})

// Configurations
const addConfigDialog = new Dialog("#add-configuration-dialog")
const addConfigBtn = document.querySelector("#add-configuration-btn")
addConfigBtn.addEventListener("click", () => addConfigDialog.show())

const configurations = document.querySelectorAll(".config-item")
configurations.forEach((config) => {
    const editDialog = new Dialog(config.querySelector(".edit-config-dialog"))

    const editBtn = config.querySelector(".edit")

    editBtn.addEventListener("click", () => editDialog.show())

    const deleteDialog = new Dialog(
        config.querySelector(".delete-config-dialog")
    )
    const onDeleteSubmitted = (e) => {
        e.preventDefault()
        const confirmInput = e.target.querySelector("input.delete")
        confirmInput.setCustomValidity("")

        const confirmInputValue = confirmInput.value
        if (confirmInputValue !== "Delete") {
            confirmInput.setCustomValidity('Enter "Delete" to confirm deletion')
            return
        }
        e.target.submit()
    }
    const deleteForm = deleteDialog.dialog.querySelector("form")
    deleteForm.addEventListener("submit", onDeleteSubmitted)
    const deleteBtn = config.querySelector(".delete")
    deleteBtn.addEventListener("click", () => deleteDialog.show())
})

// Model
const editModelBtn = document.querySelector("#edit-model-btn")
const editModelDialog = new Dialog(".edit-model-dialog")
editModelBtn.addEventListener("click", () => editModelDialog.show())

const deleteModelBtn = document.querySelector("#delete-model-btn")
const deleteModelDialog = new Dialog(".delete-model-dialog")
deleteModelBtn.addEventListener("click", () => deleteModelDialog.show())
