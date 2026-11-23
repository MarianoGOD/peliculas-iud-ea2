const express = require('express');
const cors = require('cors');
const conexion = require('./config/db');
const generoRoutes = require('./routes/generoRoutes');
const directorRoutes = require('./routes/directorRoutes');
const productoraRoutes = require('./routes/productoraRoutes');
const tipoRoutes = require('./routes/tipoRoutes');
const mediaRoutes = require('./routes/mediaRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/generos', generoRoutes);
app.use('/api/directores', directorRoutes);
app.use('/api/productoras', productoraRoutes);
app.use('/api/tipos', tipoRoutes);
app.use('/api/medias', mediaRoutes);

app.get('/', (req, res) => {
    res.json({
        mensaje: 'API de peliculas funcionando correctamente'
    });
});

app.get('/api/prueba-db', async (req, res) => {
    try {
        const [resultado] = await conexion.query('SELECT 1 AS conexion');

        res.json({
            mensaje: 'Conexion con la base de datos exitosa',
            resultado: resultado[0].conexion
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al conectar con la base de datos',
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
});