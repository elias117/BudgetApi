const { Pool } = require("pg");
require("dotenv").config();
const isProduction = process.env.NODE_ENV === "production";
const connectionString = `postgresql://${process.env.PGUSER}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`;

const db = new Pool({
    connectionString: isProduction
        ? process.env.DATABASE_URL
        : connectionString,
    //ssl: isProduction,
});

module.exports = { db };
