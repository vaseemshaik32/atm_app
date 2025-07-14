import express from 'express';
import { pool } from './server.js';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3 } from './server.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

router.post('/register', async (req, res) => {
  const {
    username,password,email,fileExt,contentType,useDefaultImage} = req.body;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Step 1: Insert user and get ID
    const insertUserQuery = `
      INSERT INTO users (username, password, email)
      VALUES ($1, $2, $3)
      RETURNING id
    `;
    const userResult = await client.query(insertUserQuery, [username, password, email]);
    const userId = userResult.rows[0].id;

    let fileUrl;
    let signedUrl = null;

    // Step 2: Handle image logic
    if (useDefaultImage) {
      fileUrl = 'https://atm-bucket-markelof32.s3.ap-south-1.amazonaws.com/default_avatar.png';
    } else {
      if (!fileExt || !contentType) {
        throw new Error('Missing file metadata for image upload');
      }

      const key = `users/${username}-${uuidv4()}.${fileExt}`;
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET,
        Key: key,
        ContentType: contentType
      });

      signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 });
      fileUrl = `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    }

    // Step 3: Insert into userstats with fileUrl
    const insertStatsQuery = `
      INSERT INTO userstats (user_id, s3_url)
      VALUES ($1, $2)
    `;
    await client.query(insertStatsQuery, [userId, fileUrl]);

    await client.query('COMMIT');

    // Step 4: Send response
    const responsePayload = {
      message: 'Registered successfully',
      profile_pic_final_url: fileUrl
    };

    if (signedUrl) {
      responsePayload.profile_pic_upload_url = signedUrl;
    }

    res.status(200).json(responsePayload);

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error during registration:', error);
    res.status(400).json('Registration failed: ' + error.message);
  } finally {
    client.release();
  }
});

export default router;


