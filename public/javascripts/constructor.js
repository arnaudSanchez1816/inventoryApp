import {
    ConstructorLogoInput,
    onConstructorFormSubmit,
} from "./constructorUtils.js"
import DeleteForm from "./deleteForm.js"
import Dialog from "./dialog.js"

const editBtn = document.querySelector("#edit-constructor-btn")
const editDialog = new Dialog(".edit-constructor-dialog")
editBtn.addEventListener("click", () => editDialog.show())

const logoInput = new ConstructorLogoInput(
    editDialog.dialog.querySelector(".logo-input-container")
)

const editForm = editDialog.dialog.querySelector("form")
editForm.addEventListener("submit", (e) =>
    onConstructorFormSubmit(e, logoInput)
)

const deleteBtn = document.querySelector("#delete-constructor-btn")
const deleteDialog = new Dialog(".delete-constructor-dialog")
const deleteForm = new DeleteForm(deleteDialog.dialog.querySelector("form"))
deleteBtn.addEventListener("click", () => deleteDialog.show())

const addModelBtn = document.querySelector("#add-model-btn")
const addModelDialog = new Dialog(".add-model-dialog")
addModelBtn.addEventListener("click", () => addModelDialog.show())
