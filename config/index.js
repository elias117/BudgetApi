const { Pool } = require("pg");
require("dotenv").config();
const isProduction = process.env.NODE_ENV === "production";
const connectionString = `postgresql://${process.env.PGUSER}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`;

const db = new Pool({
    connectionString: isProduction
        ? process.env.DATABASE_URL
        : connectionString,
    ssl: isProduction ? { rejectUnauthorized: false } : null,
});
const createEnvelopeTable =
    "CREATE TABLE envelopes ( id SERIAL PRIMARY KEY NOT NULL, name TEXT UNIQUE NOT NULL, budget MONEY NOT NULL )";
const createTransactionTable =
    "CREATE TABLE transactions ( id SERIAL PRIMARY KEY NOT NULL, envelope_id INTEGER REFERENCES envelopes(id) NOT NULL, date DATE NOT NULL, amount MONEY NOT NULL )";
async function createTables() {
    console.log("creating tables");
    try {
        await db.query(createEnvelopeTable);
        await db.query(createTransactionTable);
    } catch (e) {
        console.log("Tables already exists");
    }
}
createTables();
module.exports = { db };
