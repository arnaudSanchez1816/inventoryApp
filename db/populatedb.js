#! /usr/bin/env node

require("dotenv").config()
const { Client } = require("pg")
const fs = require("fs/promises")
const path = require("path")

async function main() {
    const client = new Client()

    try {
        console.log("seeding...")
        await client.connect()
        const sqlString = await fs.readFile(
            path.join(__dirname, "queries/seedDatabase.pgsql"),
            "utf-8"
        )
        await client.query(sqlString)
    } catch (error) {
        console.error(error)
    } finally {
        await client.end()
        console.log("done")
    }
}

main()
