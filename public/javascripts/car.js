import { showDeleteTrimDialog, showEditTrimDialog } from "./trimDialogs.js"

const modelData = JSON.parse(
    document.querySelector("#module-car").dataset.modelJson
)

const trims = document.querySelectorAll(".trim")
function onEditTrim(e, trimData) {
    showEditTrimDialog(trimData)
}

trims.forEach((trim) => {
    const dataset = trim.dataset
    const trimData = modelData.trims.find((t) => t.id === Number(dataset.id))

    const editBtn = trim.querySelector(".edit")
    editBtn.addEventListener("click", (e) => onEditTrim(e, trimData))
    const deleteBtn = trim.querySelector(".delete")
    deleteBtn.addEventListener("click", () => showDeleteTrimDialog(trimData))
})
