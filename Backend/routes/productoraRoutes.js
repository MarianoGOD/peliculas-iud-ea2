const express = require('express');
const router = express.Router();

const productoraController = require('../controllers/productoraController');

// Consultar todas las productoras
router.get('/', productoraController.obtenerTodas);

// Consultar una productora por su ID
router.get('/:id', productoraController.obtenerPorId);

// Registrar una productora
router.post('/', productoraController.crear);

// Actualizar una productora
router.put('/:id', productoraController.actualizar);

// Eliminar una productora
router.delete('/:id', productoraController.eliminar);

module.exports = router;