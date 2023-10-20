import pgPromise from 'pg-promise';
import { IClient } from 'pg-promise/typescript/pg-subset';
declare const pgp: pgPromise.IMain<{}, IClient>;
declare const db: pgPromise.IDatabase<{}, IClient>;
export { db, pgp };
