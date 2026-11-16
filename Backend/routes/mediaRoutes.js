const express = require('express');
const router = express.Router();

const mediaController = require('../controllers/mediaController');

// Consultar todas las peliculas y series
router.get('/', mediaController.obtenerTodas);

// Consultar una produccion por su ID
router.get('/:id', mediaController.obtenerPorId);

// Registrar una pelicula o serie
router.post('/', mediaController.crear);

// Actualizar una pelicula o serie
router.put('/:id', mediaController.actualizar);

// Eliminar una pelicula o serie
router.delete('/:id', mediaController.eliminar);

module.exports = router;