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
            console.log("hello")
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
