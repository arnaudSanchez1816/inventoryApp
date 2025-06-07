const db = require("./pool")
const fs = require("fs/promises")
const path = require("path")

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

module.exports = { getConstructors, getConstructorDetails }
