import {
    ConstructorLogoInput,
    onConstructorFormSubmit,
} from "./constructorUtils.js"
import Dialog from "./dialog.js"

const addConstructorBtn = document.querySelector("#add-new-constructor")
const addConstructorDialog = new Dialog(".add-constructor-dialog")
addConstructorBtn.addEventListener("click", () => {
    addConstructorDialog.show()
})

const logoInput = new ConstructorLogoInput(
    addConstructorDialog.dialog.querySelector(".logo-input-container")
)

const editForm = addConstructorDialog.dialog.querySelector("form")
editForm.addEventListener("submit", (e) =>
    onConstructorFormSubmit(e, logoInput)
)
