import { config } from 'dotenv';
import { Pool } from 'pg';

config();

let connectionString;
let ssl;

if (process.env.NODE_ENV === 'production') {
    connectionString = process.env.DATABASE_URL;
    ssl = true;
} else {
    connectionString = process.env.DATABASE_URL_LOCAL;
    ssl = false;
}
console.log(connectionString);

const connectToPg = new Pool({ connectionString, ssl });

export default connectToPg;
