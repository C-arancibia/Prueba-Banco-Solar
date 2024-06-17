// index.mjs
import express from 'express';
import { insertarUsuario, obtenerUsuarios, realizarTransferencia } from './queries.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Ruta para registrar un nuevo usuario
app.post('/usuario', async (req, res) => {
    const { nombre, balance } = req.body;

    try {
        const nuevoUsuario = await insertarUsuario(nombre, balance);
        res.status(201).json(nuevoUsuario);
    } catch (error) {
        console.error('Error al insertar usuario:', error);
        res.status(500).send('Error al insertar usuario');
    }
});

// Ruta para obtener todos los usuarios
app.get('/usuarios', async (req, res) => {
    try {
        const usuarios = await obtenerUsuarios();
        res.status(200).json(usuarios);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).send('Error al obtener usuarios');
    }
});

// Ruta para realizar una transferencia
app.post('/transferencia', async (req, res) => {
    const { emisor, receptor, monto } = req.body;

    try {
        const transferenciaId = await realizarTransferencia(emisor, receptor, monto);
        res.status(201).json({ id: transferenciaId });
    } catch (error) {
        console.error('Error al realizar transferencia:', error);
        res.status(500).send('Error al realizar transferencia');
    }
});

// Manejo de errores para rutas no encontradas
app.use((req, res) => {
    res.status(404).send('Ruta no encontrada');
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
