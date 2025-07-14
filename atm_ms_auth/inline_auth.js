import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';
import { redisClient } from './server.js';
dotenv.config();

const auth = async (req, res, next) => {
  const token = req.cookies?.token;
  const isexpired=await redisClient.sIsMember('expireed_tokens',token)
  if (!token || isexpired) {
    return res.status(401).json('Invalid token');
  }

  try {
    const payload = JWT.verify(token, process.env.MY_JWT_SECRET);
    req.uid = payload.userID;
    req.hashtoken = token;
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(401).json('Authentication failed');
  }
};

export default auth;
