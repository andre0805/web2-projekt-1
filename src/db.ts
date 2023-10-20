import pgPromise from 'pg-promise';
import dotenv from 'dotenv';
import { IClient, IConnectionParameters } from 'pg-promise/typescript/pg-subset';
dotenv.config();

const pgp = pgPromise();

// Configure the connection details for your PostgreSQL database
const connection: IConnectionParameters<IClient> = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    ssl: true,
};

// Create a PostgreSQL database connection
const db = pgp(connection);

export { db, pgp };