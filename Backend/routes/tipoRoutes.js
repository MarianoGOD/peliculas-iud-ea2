const express = require('express');
const router = express.Router();

const tipoController = require('../controllers/tipoController');

// Consultar todos los tipos
router.get('/', tipoController.obtenerTodos);

// Consultar un tipo por su ID
router.get('/:id', tipoController.obtenerPorId);

// Registrar un tipo
router.post('/', tipoController.crear);

// Actualizar un tipo
router.put('/:id', tipoController.actualizar);

// Eliminar un tipo
router.delete('/:id', tipoController.eliminar);

module.exports = router;
