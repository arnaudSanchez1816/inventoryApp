import Dialog from "./dialog.js"

const menu = document.querySelector(".menu")
const menuDialog = new Dialog(menu)
const menuBtn = document.querySelector(".menu-btn")

menuBtn.addEventListener("click", () => menuDialog.show())
