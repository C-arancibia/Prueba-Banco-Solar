// queries.js
const pool = require('./db');  // Asegúrate de que el pool de conexiones esté importado correctamente

// Función para insertar un nuevo usuario
async function insertarUsuario(nombre, balance) {
    const client = await pool.connect();
    try {
        const query = 'INSERT INTO usuarios (nombre, balance) VALUES ($1, $2) RETURNING *';
        const result = await client.query(query, [nombre, balance]);
        return result.rows[0];
    } finally {
        client.release();
    }
}

// Función para obtener todos los usuarios
async function obtenerUsuarios() {
    const client = await pool.connect();
    try {
        const query = 'SELECT * FROM usuarios';
        const result = await client.query(query);
        return result.rows;
    } finally {
        client.release();
    }
}

// Función para realizar una transferencia
async function realizarTransferencia(emisor, receptor, monto) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Insertar la transferencia
        const insertTransferenciaQuery = 'INSERT INTO transferencias (emisor, receptor, monto, fecha) VALUES ($1, $2, $3, NOW()) RETURNING id';
        const insertTransferenciaResult = await client.query(insertTransferenciaQuery, [emisor, receptor, monto]);
        const transferenciaId = insertTransferenciaResult.rows[0].id;

        // Actualizar el balance del emisor
        const updateEmisorQuery = 'UPDATE usuarios SET balance = balance - $1 WHERE id = $2';
        await client.query(updateEmisorQuery, [monto, emisor]);

        // Actualizar el balance del receptor
        const updateReceptorQuery = 'UPDATE usuarios SET balance = balance + $1 WHERE id = $2';
        await client.query(updateReceptorQuery, [monto, receptor]);

        await client.query('COMMIT');
        return transferenciaId;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

module.exports = {
    insertarUsuario,
    obtenerUsuarios,
    realizarTransferencia
};
