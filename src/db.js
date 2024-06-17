// db.js (o similar)
const { Pool } = require('pg');

const pool = new Pool({
  user: 'camilaa',                // Nombre de usuario de PostgreSQL
  host: 'localhost',              // Host de PostgreSQL
  database: 'bancosolar',         // Nombre de tu base de datos
  password: 'freihit89',          // Contraseña de acceso a PostgreSQL
  port: 5432,                     // Puerto por defecto de PostgreSQL
});

module.exports = pool;
