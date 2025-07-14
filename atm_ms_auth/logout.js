import express from 'express';
import dotenv from 'dotenv';
import { pool } from './server.js';
import auth from './inline_auth.js';
import { redisClient } from './server.js';

dotenv.config();
const router = express.Router();

router.put('/logout', auth, async (req, res) => {
  const tok = req.hashtoken;

  const updateQuery = `
    UPDATE userstats
    SET
      userlat = 0,
      userlong = 0,
      status = false,
      needscash = false,
      needsdigital = false,
      tranamount = 0
    WHERE user_id = $1
  `;

  try {
    await pool.query(updateQuery, [req.uid]);
    await redisClient.sAdd('expired_tokens', tok);

    res.status(200).json('Logged out successfully');
  } catch (error) {
    console.error('Logout failed:', error);
    res.status(400).json('Failed to logout');
  }
});

export default router;


