import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

//обработка ошибок во время подключения 
pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

export default pool;