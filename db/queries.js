const db = require("./pool")
const fs = require("fs/promises")
const path = require("path")
const { convertConstructorLogoPath } = require("../utils/utils")

async function getCarModels({ nbItems = 20, sortBy = "id" } = {}) {
    const { rows } = await db.query(
        `SELECT models.id, models.name, year, json_build_object('id', c.id, 'name', c.name, 'country', c.country, 'logo_path', logo_path) constructor
        FROM models 
        JOIN constructors AS c ON models.constructor_id = c.id 
        GROUP BY models.id, c.id
        ORDER BY ${sortBy}
        LIMIT $1`,
        [nbItems]
    )

    rows.forEach((row) => {
        convertConstructorLogoPath(row.constructor)
    })

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
    const modelDetails = rows[0].results
    convertConstructorLogoPath(modelDetails.constructor)

    return modelDetails
}

// Constructors
async function getConstructors({ nbItems = 20, sortBy = "id" } = {}) {
    const { rows } = await db.query(
        `SELECT id, name, country, logo_path 
        FROM constructors 
        ORDER BY ${sortBy}
        LIMIT $1`,
        [nbItems]
    )
    rows.forEach((row) => {
        convertConstructorLogoPath(row)
    })

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
    const constructor = rows[0].results
    convertConstructorLogoPath(constructor)

    return constructor
}

async function addConstructor({ name, country, logo_path }) {
    await db.query(
        "INSERT INTO constructors (name, country, logo_path) VALUES($1, $2, $3);",
        [name, country, logo_path]
    )
}

async function updateConstructor({ id, name, country, logo_path }) {
    await db.query(
        "UPDATE constructors SET name=$2, country=$3, logo_path=$4 WHERE id = $1;",
        [id, name, country, logo_path]
    )
}

async function deleteConstructor(id) {
    await db.query("DELETE FROM constructors WHERE id = $1", [id])
}

async function getCars(modelId) {
    const sqlString = await fs.readFile(
        path.join(__dirname, "queries/getCarModelConfigurations.pgsql"),
        "utf-8"
    )
    const { rows } = await db.query(sqlString, [modelId])

    return rows
}

async function searchConstructors(name) {
    const { rows } = await db.query(
        `SELECT *
        FROM constructors 
        WHERE name ILIKE '%' || $1 || '%'
        ORDER BY name`,
        [name]
    )
    rows.forEach((row) => {
        convertConstructorLogoPath(row)
    })

    return rows
}

async function searchCarModels(name) {
    const { rows } = await db.query(
        `SELECT *
        FROM models 
        WHERE name ILIKE '%' || $1 || '%'
        ORDER BY name`,
        [name]
    )

    return rows
}

// Trims
async function updateCarTrim(trimId, name) {
    await db.query("UPDATE trims SET name=$2 WHERE id=$1", [trimId, name])
}

async function deleteCarTrim(trimId) {
    await db.query("DELETE FROM trims WHERE id=$1", [trimId])
}

async function addCarTrim(modelId, name) {
    await db.query("INSERT INTO trims (model_id, name) VALUES ($1, $2)", [
        modelId,
        name,
    ])
}

module.exports = {
    getConstructors,
    getConstructorDetails,
    getCarModels,
    getCarModelDetails,
    addConstructor,
    updateConstructor,
    deleteConstructor,
    getCars,
    searchCarModels,
    searchConstructors,
    updateCarTrim,
    deleteCarTrim,
    addCarTrim,
}
