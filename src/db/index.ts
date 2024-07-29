import { drizzle } from "drizzle-orm/mysql2";
import * as constants from "../constants";
import { createPool } from "mysql2/promise";
import { logger } from "../logging";

let ssl = false;

let pool = createPool({
    host: constants.MY_HOST,
    port: constants.MY_PORT,
    user: constants.MY_USER,
    password: constants.MY_PASS,
    database: constants.MY_DB,
});

logger.info(
    "Connecting to database with info:" +
        `\nHOST: ${constants.MY_HOST}` +
        `\nPORT: ${constants.MY_PORT}` +
        `\nUSER: ${constants.MY_USER}`,
);

const db = drizzle(pool, { logger: true });

export default db;
