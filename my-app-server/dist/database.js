"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
require("dotenv/config");
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
});
//обработка ошибок во время подключения 
pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});
exports.default = pool;
