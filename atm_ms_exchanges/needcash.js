import express from 'express';
import axios from 'axios';
import getdis from './distance.js';
import { pool } from './server.js';

const router = express.Router();


router.put('/needcash', async (req, res) => {
  try {
    const idofsender = req.headers['x-user-id'];
    if (!idofsender) return res.status(401).json({ error: 'Unauthorized' });

    const amountneeded = req.body.amount;

    // Update sender to indicate they need cash
    await pool.query(`
      UPDATE userstats
      SET needscash = true,
          needsdigital = false,
          tranamount = $1
      WHERE user_id = $2
    `, [amountneeded, idofsender]);

    // Get sender's coordinates
    const senderResult = await pool.query(`
      SELECT userlat, userlong
      FROM userstats
      WHERE user_id = $1
    `, [idofsender]);

    if (senderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Sender not found' });
    }

    const { userlat, userlong } = senderResult.rows[0];

    // Find digital providers (receivers)
    const receiversResult = await pool.query(`
      SELECT us.*, u.username
      FROM userstats us
      JOIN users u ON u.id = us.user_id
      WHERE us.status = true
        AND us.needsdigital = true
        AND us.tranamount >= $1
    `, [amountneeded]);

    const receiversWithDistance = receiversResult.rows.map(receiver => {
      const distance = getdis(userlat, userlong, receiver.userlat, receiver.userlong);
      return [distance, receiver];
    });

    receiversWithDistance.sort((a, b) => a[0] - b[0]);

    res.status(200).json(receiversWithDistance);
  } catch (error) {
    console.error('needcash route error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

export default router;
