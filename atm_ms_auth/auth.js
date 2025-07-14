import express from 'express';
import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';
import { redisClient } from './server.js';

dotenv.config();
const router = express.Router();

router.get('/verify', async (req, res) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ valid: false });
  }

  try {
    // Check if the token was invalidated (e.g., during logout)
    const isExpired = await redisClient.sIsMember('expired_tokens', token);
    if (isExpired) {
      return res.status(401).json({ valid: false });
    }

    // Decode the token and extract the userID (numeric id)
    const data = JWT.verify(token, process.env.MY_JWT_SECRET);
    res.header('X-User-ID', data.userID);  
    console.log(data.userID)
    res.status(200).json({ valid: true, userID: data.userID });
  } catch (err) {
    console.log('some error')
    res.status(401).json({ valid: false });
  }
});

export default router;




