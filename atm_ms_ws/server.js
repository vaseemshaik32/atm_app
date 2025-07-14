import http from 'http';
import dotenv from 'dotenv';
import { setupWebSocketServer } from './socket.js';
import { createClient } from 'redis';
import pkg from 'pg';

const { Pool } = pkg;
dotenv.config();

// PostgreSQL pool
export const pool = new Pool({
  user: process.env.POSTGRES_USERNAME,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT
});

// Retry logic for Postgres connection
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const checkPostgres = async (retries = 5, delay = 3000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const client = await pool.connect();
      await client.query('SELECT 1');
      console.log(' Connected to Postgres');
      client.release();
      break;
    } catch (err) {
      console.error(`Postgres connection failed (attempt ${attempt}/${retries}):`, err.message);
      if (attempt < retries) {
        await wait(delay);
      } else {
        console.error('Could not connect to Postgres after several attempts.');
        process.exit(1); // Optional: exit service if DB is essential
      }
    }
  }
};

await checkPostgres();

// Redis connection
const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  },
  password: process.env.REDIS_PASSWORD
});

redisClient.on('error', err => console.error('Redis error:', err));
await redisClient.connect();
console.log('Connected to Redis');

const server = http.createServer(); // No Express necessary if no routes
setupWebSocketServer(server);
server.listen(5000, () => console.log('WebSocket microservice listening on port 5000'));

export default redisClient;
