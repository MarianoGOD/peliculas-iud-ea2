const express = require('express');
const router = express.Router();

const directorController = require('../controllers/directorController');

// Consultar todos los directores
router.get('/', directorController.obtenerTodos);

// Consultar un director por su ID
router.get('/:id', directorController.obtenerPorId);

// Registrar un director
router.post('/', directorController.crear);

// Actualizar un director
router.put('/:id', directorController.actualizar);

// Eliminar un director
router.delete('/:id', directorController.eliminar);

module.exports = router;