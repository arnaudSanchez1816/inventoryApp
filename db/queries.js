const db = require("./pool")
const fs = require("fs/promises")
const path = require("path")
const { convertConstructorLogoPath } = require("../utils/utils")

async function getCarModels({
    nbItems = 20,
    sortBy = "id",
    order = "desc",
} = {}) {
    const { rows } = await db.query(
        `SELECT models.id, models.name, year, to_jsonb(c) constructor
        FROM models 
        JOIN constructors AS c ON models.constructor_id = c.id 
        ORDER BY ${sortBy}  ${order.toUpperCase() === "DESC" ? "DESC" : "ASC"}
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

async function addCarModel({ name, year, constructorId }) {
    const { rows } = await db.query(
        `
        INSERT INTO models(name, year, constructor_id)
        VALUES($1, $2, $3)
        RETURNING id;
        `,
        [name, year, constructorId]
    )

    return rows[0].id
}

async function updateCarModel({ name, year, modelId }) {
    await db.query(
        `
        UPDATE models
        SET name=$2, year=$3
        WHERE id=$1
        `,
        [modelId, name, year]
    )
}

async function deleteCarModel({ modelId }) {
    await db.query("DELETE FROM models WHERE id=$1", [modelId])
}

// Configs
async function getConfigurations(modelId) {
    const sqlString = await fs.readFile(
        path.join(__dirname, "queries/getCarModelConfigurations.pgsql"),
        "utf-8"
    )
    const { rows } = await db.query(sqlString, [modelId])

    return rows
}

async function addNewConfiguration({
    modelId,
    trimId,
    powertrainId,
    price,
    stock,
}) {
    await db.query(
        `
        INSERT INTO configurations(model_id, trim_id, powertrain_id, price, stock)
        VALUES($1, $2, $3, $4, $5);
        `,
        [modelId, trimId, powertrainId, price, stock]
    )
}

async function updateConfiguration({
    modelId,
    trimId,
    powertrainId,
    price,
    stock,
}) {
    await db.query(
        `
        UPDATE configurations
        SET price=$4, stock=$5
        WHERE model_id=$1 AND trim_id=$2 AND powertrain_id=$3;
        `,
        [modelId, trimId, powertrainId, price, stock]
    )
}

async function deleteConfiguration({ modelId, trimId, powertrainId }) {
    await db.query(
        `
        DELETE FROM configurations
        WHERE model_id=$1 AND trim_id=$2 AND powertrain_id=$3;`,
        [modelId, trimId, powertrainId]
    )
}

// Constructors
async function getConstructors({
    nbItems = 20,
    sortBy = "id",
    order = "desc",
} = {}) {
    const { rows } = await db.query(
        `SELECT id, name, country, logo_path 
        FROM constructors 
        ORDER BY ${sortBy} ${order.toUpperCase() === "DESC" ? "DESC" : "ASC"}
        LIMIT $1;`,
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

async function addConstructor({ name, country, logoFileExtension }) {
    const client = await db.connect()
    try {
        await client.query(`BEGIN`)
        const { rows } = await client.query(
            `        
            INSERT INTO constructors (name, country) 
            VALUES($1, $2) 
            RETURNING id;`,
            [name, country]
        )
        const constructorId = rows[0].id

        await client.query(
            `        
            UPDATE constructors
            SET logo_path=CONCAT($1, $2::text)
            WHERE id = $1;`,
            [constructorId, logoFileExtension]
        )
        await client.query("COMMIT")
        return constructorId
    } catch (error) {
        await client.query("ROLLBACK")
        throw error
    } finally {
        client.release()
    }
}

async function updateConstructor({ id, name, country, logoPath }) {
    if (logoPath === undefined) {
        await db.query(
            "UPDATE constructors SET name=$2, country=$3 WHERE id = $1;",
            [id, name, country]
        )
    } else {
        await db.query(
            "UPDATE constructors SET name=$2, country=$3, logo_path=$4 WHERE id = $1;",
            [id, name, country, logoPath]
        )
    }
}

async function deleteConstructor(id) {
    const { rows } = await db.query(
        "DELETE FROM constructors WHERE id = $1 RETURNING logo_path;",
        [id]
    )

    return rows[0].logoPath
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
        `SELECT models.*, to_jsonb(constructors) constructor
        FROM models
        LEFT JOIN constructors ON constructors.id = models.constructor_id
        WHERE models.name ILIKE '%' || $1 || '%'
        ORDER BY models.name;`,
        [name]
    )

    rows.forEach((row) => {
        convertConstructorLogoPath(row.constructor)
    })

    return rows
}

// Trims
async function updateCarTrim(trimId, name, displayName) {
    await db.query("UPDATE trims SET name=$2, display_name=$3 WHERE id=$1", [
        trimId,
        name,
        displayName,
    ])
}

async function deleteCarTrim(trimId) {
    await db.query("DELETE FROM trims WHERE id=$1", [trimId])
}

async function addCarTrim(modelId, name, displayName) {
    await db.query(
        "INSERT INTO trims (model_id, name, display_name) VALUES ($1, $2, $3)",
        [modelId, name, displayName]
    )
}

// Powertrains

async function addPowertrain(
    modelId,
    {
        name,
        engineCode,
        type,
        displacement,
        power,
        torque,
        engineLayout,
        transmission,
        drivetrain,
        trims,
    }
) {
    await db.query(
        "CALL insert_powertrain($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);",
        [
            name,
            type,
            engineCode,
            displacement,
            power,
            torque,
            engineLayout,
            transmission,
            drivetrain,
            modelId,
            trims,
        ]
    )
}

async function updatePowertrain({
    id,
    name,
    engineCode,
    type,
    displacement,
    power,
    torque,
    engineLayout,
    transmission,
    drivetrain,
    trims,
}) {
    await db.query(
        "CALL update_powertrain($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);",
        [
            id,
            name,
            type,
            engineCode,
            displacement,
            power,
            torque,
            engineLayout,
            transmission,
            drivetrain,
            trims,
        ]
    )
}

module.exports = {
    getConstructors,
    getConstructorDetails,
    getCarModels,
    getCarModelDetails,
    addCarModel,
    updateCarModel,
    deleteCarModel,
    addConstructor,
    updateConstructor,
    deleteConstructor,
    getConfigurations,
    searchCarModels,
    searchConstructors,
    updateCarTrim,
    deleteCarTrim,
    addCarTrim,
    addPowertrain,
    updatePowertrain,
    addNewConfiguration,
    updateConfiguration,
    deleteConfiguration,
}
