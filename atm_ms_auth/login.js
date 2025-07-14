import express from 'express';
import dotenv from 'dotenv';
import JWT from 'jsonwebtoken';
import { pool } from './server.js';

const router = express.Router();
dotenv.config();

router.post('/login', async (req, res) => {
  const { password, email, latitude, longitude } = req.body;

  try {
    // Fetch user by email, and get id, username, and password
    const userQuery = `
      SELECT u.id, u.username, u.password, us.s3_url
      FROM users u
      JOIN userstats us ON u.id = us.user_id
      WHERE u.email = $1`;
    const result = await pool.query(userQuery, [email]);

    if (result.rows.length === 0) {
      return res.status(400).json('Please register first');
    }

    const user = result.rows[0];

    if (user.password !== password) {
      return res.status(400).json('Incorrect password');
    }

    // Sign token with user.id now (not username)
    const payload = {
      userID: user.id,
      iat: Math.floor(Date.now() / 1000),
    };

    const token = JWT.sign(payload, process.env.MY_JWT_SECRET);

    // Set secure cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,         // Set to false for HTTP in dev
      sameSite: 'None',       // More relaxed, good for local testing
      path: '/',
      maxAge: 3600000
    });
    

    // Update userstats using user_id (not username)
    await pool.query(
      `UPDATE userstats
       SET status = true, userlat = $1, userlong = $2
       WHERE user_id = $3`,
      [latitude, longitude, user.id]
    );

    // Send username back to frontend for display
    res.status(200).json({
      usernameforreact: user.username,
      profilePicURL: user.s3_url
    });
        
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json('Failed to login');
  }
});

export default router;
