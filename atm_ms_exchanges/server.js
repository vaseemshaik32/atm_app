import express from 'express';
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import needdigitalrouter from './needdigital.js';
import needcashrouter from './needcash.js';
import pkg from 'pg';
import { createClient } from 'redis';

const { Pool } = pkg;
dotenv.config();

const app = express();
app.use(cookieParser());
app.use(express.json());

// === Postgres setup with retry ===
export const pool = new Pool({
  user: process.env.POSTGRES_USERNAME,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT
});

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const checkPostgres = async (retries = 5, delay = 3000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const client = await pool.connect();
      await client.query('SELECT 1');
      console.log('✅ Connected to Postgres');
      client.release();
      break;
    } catch (err) {
      console.error(`❌ Postgres failed (attempt ${attempt}/${retries}):`, err.message);
      if (attempt < retries) {
        console.log(`⏳ Retrying in ${delay / 1000}s...`);
        await wait(delay);
      } else {
        console.error('🔥 Postgres unreachable after several attempts.');
        process.exit(1);
      }
    }
  }
};

await checkPostgres();

// === Redis setup ===
export const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  },
  password: process.env.REDIS_PASSWORD
});

redisClient.on('error', err => console.error('Redis error:', err));
await redisClient.connect();
console.log('Connected to Redis');

// === Routes ===
app.get('/', (req, res) => res.json('hello world'));
app.use('/api/exchanges', needdigitalrouter);
app.use('/api/exchanges', needcashrouter);

// === Start server ===
const PORT = 6000;
app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
