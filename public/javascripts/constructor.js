import {
    ConstructorLogoInput,
    onConstructorFormSubmit,
} from "./constructorUtils.js"
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
