import express from 'express';
import http from 'http';
import cookieParser from 'cookie-parser';
import loginrouter from './login.js';
import registerrouter from './register.js';
import logoutrouter from './logout.js';
import authrouter from './auth.js';
import dotenv from 'dotenv';
import pkg from 'pg';
import { createClient } from 'redis';
import { S3Client } from '@aws-sdk/client-s3';

dotenv.config();
const { Pool } = pkg;

const app = express();
const server = http.createServer(app);
app.use(cookieParser());
app.use(express.json());

const initializeTables = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS userstats (
        id SERIAL PRIMARY KEY,
        status BOOLEAN NOT NULL DEFAULT FALSE,
        needsdigital BOOLEAN DEFAULT FALSE,
        needscash BOOLEAN DEFAULT FALSE,
        tranamount NUMERIC DEFAULT 0,
        totalexchange NUMERIC NOT NULL DEFAULT 0,
        user_id INTEGER NOT NULL,
        userlat NUMERIC NOT NULL DEFAULT 0,
        userlong NUMERIC NOT NULL DEFAULT 0,
        s3_url TEXT DEFAULT 'https://atm-bucket-markelof32.s3.ap-south-1.amazonaws.com/default_avatar.png',
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `);
    console.log("Tables ensured");
  } catch (err) {
    console.error("Error ensuring tables:", err);
  } finally {
    client.release();
  }
};

//connect to s3
export const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});


//connect to postgres
const pool = new Pool({
  user: process.env.POSTGRES_USERNAME,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: Number(process.env.POSTGRES_PORT || 5432),
});

export { pool };

const waitForPostgres = async () => {
  const maxRetries = 10;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const client = await pool.connect();
      await client.query('SELECT 1');
      client.release();
      console.log('✅ Connected to Postgres');
      return;
    } catch (err) {
      attempt++;
      console.log(`⏳ Waiting for Postgres... (attempt ${attempt}/${maxRetries})`);
      await new Promise((res) => setTimeout(res, 2000));
    }
  }

  console.error('❌ Postgres not reachable after max retries. Exiting.');
  process.exit(1);
};

// Redis connection
export const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
  password: process.env.REDIS_PASSWORD,
});

redisClient.on('error', err => console.error('Redis error:', err));

const connectToRedis = async () => {
  await redisClient.connect();
  console.log('✅ Connected to Redis');
};


const startServer = async () => {
  await waitForPostgres();
  await connectToRedis();
  await initializeTables();

  app.get('/', (req, res) => res.json('hello world'));
  app.use('/api/auth/', loginrouter);
  app.use('/api/auth/', registerrouter);
  app.use('/api/auth/', logoutrouter);
  app.use('/api/auth/', authrouter);

  const PORT = 1000;
  server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
};

startServer();
