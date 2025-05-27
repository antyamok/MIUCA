// src/db.js
import mysql from 'mysql2/promise';

// Crée un pool de connexions réutilisables
export const pool = mysql.createPool({
  host: process.env.DB_HOST,     // ex. 'localhost'
  port: process.env.DB_PORT,     // ex. '3306'
  user: process.env.DB_USER,     // votre utilisateur MySQL
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
