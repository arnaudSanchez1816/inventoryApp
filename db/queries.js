const db = require("./pool")
const fs = require("fs/promises")
const path = require("path")

async function getCarModels() {
    const { rows } = await db.query(
        "SELECT id, name, year, constructor_id FROM models"
    )

    return rows
}

async function getCarModelDetails(id) {
    const sqlString = await fs.readFile(
        path.join(__dirname, "queries/getCarModelDetails.pgsql"),
        "utf-8"
    )
    const { rows } = await db.query(sqlString, [id])

    if (rows.length <= 0) {
        return null
    }
    console.log(rows[0])

    return rows[0].results
}

// Constructors

async function getConstructors() {
    const { rows } = await db.query(
        "SELECT id, name, country FROM constructors"
    )

    return rows
}

async function getConstructorDetails(id) {
    const sqlString = await fs.readFile(
        path.join(__dirname, "queries/getConstructorDetails.pgsql"),
        "utf-8"
    )
    const { rows } = await db.query(sqlString, [id])

    if (rows.length <= 0) {
        return null
    }
    console.log(rows[0])

    return rows[0].results
}

async function addConstructor({ name, country }) {
    await db.query("INSERT INTO constructors (name, country) VALUES($1, $2);", [
        name,
        country,
    ])
}

async function updateConstructor({ id, name, country }) {
    await db.query(
        "UPDATE constructors SET name=$2, country=$3 WHERE id = $1;",
        [id, name, country]
    )
}

async function deleteConstructor(id) {
    await db.query("DELETE FROM constructors WHERE id = $1", [id])
}

module.exports = {
    getConstructors,
    getConstructorDetails,
    getCarModels,
    getCarModelDetails,
    addConstructor,
    updateConstructor,
    deleteConstructor,
}
