import express from 'express';
import getdis from './distance.js';
import { pool } from './server.js';

const router = express.Router();

router.put('/needdigital', async (req, res) => {
  try {
    const idofreceiver = req.headers['x-user-id'];
    if (!idofreceiver) return res.status(401).json({ error: 'Unauthorized' });

    const amountneeded = req.body.amount;

    // Update receiver's userstats
    await pool.query(`
      UPDATE userstats
      SET needsdigital = true,
          needscash = false,
          tranamount = $1
      WHERE user_id = $2
    `, [amountneeded, idofreceiver]);

    // Get receiver’s coordinates
    const receiverResult = await pool.query(`
      SELECT userlat, userlong
      FROM userstats
      WHERE user_id = $1
    `, [idofreceiver]);

    if (receiverResult.rows.length === 0) {
      return res.status(404).json({ error: 'Receiver not found' });
    }

    const { userlat, userlong } = receiverResult.rows[0];

    // Find matched donors
    const donorsResult = await pool.query(`
      SELECT us.*, u.username
      FROM userstats us
      JOIN users u ON u.id = us.user_id
      WHERE us.status = true
        AND us.needscash = true
        AND us.tranamount >= $1
    `, [amountneeded]);

    const donorsWithDistance = donorsResult.rows.map(donor => {
      const distance = getdis(userlat, userlong, donor.userlat, donor.userlong);
      return [distance, donor];
    });

    donorsWithDistance.sort((a, b) => a[0] - b[0]);

    res.status(200).json(donorsWithDistance);
  } catch (error) {
    console.error('needdigital route error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

export default router;
