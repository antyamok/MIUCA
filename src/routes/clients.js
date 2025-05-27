import express from 'express';
import { pool } from '../db';

const router = express.Router();

router.get('/', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM clients');
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { nom, email } = req.body;
  await pool.query('INSERT INTO clients (nom,email) VALUES (?,?)', [nom,email]);
  res.status(201).send();
});

export default router;
