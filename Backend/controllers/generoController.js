const generoModel = require('../models/generoModel');

// Consultar todos los generos
const obtenerTodos = async (req, res) => {
    try {
        const generos = await generoModel.obtenerTodos();

        res.json(generos);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al consultar los generos',
            error: error.message
        });
    }
};

// Consultar un genero por su ID
const obtenerPorId = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: 'El ID del genero no es valido'
            });
        }

        const genero = await generoModel.obtenerPorId(id);

        if (!genero) {
            return res.status(404).json({
                mensaje: 'Genero no encontrado'
            });
        }

        res.json(genero);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al consultar el genero',
            error: error.message
        });
    }
};

// Registrar un genero
const crear = async (req, res) => {
    try {
        const { nombre, estado, descripcion } = req.body;

        if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
            return res.status(400).json({
                mensaje: 'El nombre del genero es obligatorio'
            });
        }

        const estadoFinal = estado || 'Activo';

        if (!['Activo', 'Inactivo'].includes(estadoFinal)) {
            return res.status(400).json({
                mensaje: 'El estado debe ser Activo o Inactivo'
            });
        }

        const id = await generoModel.crear(
            nombre.trim(),
            estadoFinal,
            descripcion || null
        );

        res.status(201).json({
            mensaje: 'Genero registrado correctamente',
            id_genero: id
        });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                mensaje: 'Ya existe un genero con ese nombre'
            });
        }

        res.status(500).json({
            mensaje: 'Error al registrar el genero',
            error: error.message
        });
    }
};

// Actualizar un genero
const actualizar = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { nombre, estado, descripcion } = req.body;

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: 'El ID del genero no es valido'
            });
        }

        if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
            return res.status(400).json({
                mensaje: 'El nombre del genero es obligatorio'
            });
        }

        if (!['Activo', 'Inactivo'].includes(estado)) {
            return res.status(400).json({
                mensaje: 'El estado debe ser Activo o Inactivo'
            });
        }

        const genero = await generoModel.obtenerPorId(id);

        if (!genero) {
            return res.status(404).json({
                mensaje: 'Genero no encontrado'
            });
        }

        await generoModel.actualizar(
            id,
            nombre.trim(),
            estado,
            descripcion || null
        );

        res.json({
            mensaje: 'Genero actualizado correctamente'
        });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                mensaje: 'Ya existe un genero con ese nombre'
            });
        }

        res.status(500).json({
            mensaje: 'Error al actualizar el genero',
            error: error.message
        });
    }
};

// Eliminar un genero
const eliminar = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: 'El ID del genero no es valido'
            });
        }

        const genero = await generoModel.obtenerPorId(id);

        if (!genero) {
            return res.status(404).json({
                mensaje: 'Genero no encontrado'
            });
        }

        await generoModel.eliminar(id);

        res.json({
            mensaje: 'Genero eliminado correctamente'
        });

    } catch (error) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({
                mensaje: 'No se puede eliminar el genero porque esta asociado a una pelicula o serie'
            });
        }

        res.status(500).json({
            mensaje: 'Error al eliminar el genero',
            error: error.message
        });
    }
};

module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};