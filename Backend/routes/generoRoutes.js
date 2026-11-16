const express = require('express');
const router = express.Router();

const generoController = require('../controllers/generoController');

// Consultar todos los generos
router.get('/', generoController.obtenerTodos);

// Consultar un genero por su ID
router.get('/:id', generoController.obtenerPorId);

// Registrar un genero
router.post('/', generoController.crear);

// Actualizar un genero
router.put('/:id', generoController.actualizar);

// Eliminar un genero
router.delete('/:id', generoController.eliminar);

module.exports = router;