"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pgp = exports.db = void 0;
var pg_promise_1 = __importDefault(require("pg-promise"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var pgp = (0, pg_promise_1.default)();
exports.pgp = pgp;
// Configure the connection details for your PostgreSQL database
var connection = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    ssl: true,
};
// Create a PostgreSQL database connection
var db = pgp(connection);
exports.db = db;
