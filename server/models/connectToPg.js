import { config } from 'dotenv';
import { Pool } from 'pg';

config();

let connectionString;
let ssl;

if (process.env.NODE_ENV === 'production') {
    connectionString = process.env.HEROKU_POSTGRESQL_AQUA_URL;
    ssl = true;
} else {
    connectionString = process.env.DATABASE_URL_LOCAL;
    ssl = false;
}

const connectToPg = new Pool({ connectionString, ssl });

export default connectToPg;
