const directorModel = require('../models/directorModel');

// Consultar todos los directores
const obtenerTodos = async (req, res) => {
    try {
        const directores = await directorModel.obtenerTodos();

        res.json(directores);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al consultar los directores',
            error: error.message
        });
    }
};

// Consultar un director por su ID
const obtenerPorId = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: 'El ID del director no es valido'
            });
        }

        const director = await directorModel.obtenerPorId(id);

        if (!director) {
            return res.status(404).json({
                mensaje: 'Director no encontrado'
            });
        }

        res.json(director);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al consultar el director',
            error: error.message
        });
    }
};

// Registrar un director
const crear = async (req, res) => {
    try {
        const { nombres, estado } = req.body;

        if (!nombres || typeof nombres !== 'string' || nombres.trim() === '') {
            return res.status(400).json({
                mensaje: 'Los nombres del director son obligatorios'
            });
        }

        const estadoFinal = estado || 'Activo';

        if (!['Activo', 'Inactivo'].includes(estadoFinal)) {
            return res.status(400).json({
                mensaje: 'El estado debe ser Activo o Inactivo'
            });
        }

        const id = await directorModel.crear(
            nombres.trim(),
            estadoFinal
        );

        res.status(201).json({
            mensaje: 'Director registrado correctamente',
            id_director: id
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al registrar el director',
            error: error.message
        });
    }
};

// Actualizar un director
const actualizar = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { nombres, estado } = req.body;

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: 'El ID del director no es valido'
            });
        }

        if (!nombres || typeof nombres !== 'string' || nombres.trim() === '') {
            return res.status(400).json({
                mensaje: 'Los nombres del director son obligatorios'
            });
        }

        if (!['Activo', 'Inactivo'].includes(estado)) {
            return res.status(400).json({
                mensaje: 'El estado debe ser Activo o Inactivo'
            });
        }

        const director = await directorModel.obtenerPorId(id);

        if (!director) {
            return res.status(404).json({
                mensaje: 'Director no encontrado'
            });
        }

        await directorModel.actualizar(
            id,
            nombres.trim(),
            estado
        );

        res.json({
            mensaje: 'Director actualizado correctamente'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al actualizar el director',
            error: error.message
        });
    }
};

// Eliminar un director
const eliminar = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: 'El ID del director no es valido'
            });
        }

        const director = await directorModel.obtenerPorId(id);

        if (!director) {
            return res.status(404).json({
                mensaje: 'Director no encontrado'
            });
        }

        await directorModel.eliminar(id);

        res.json({
            mensaje: 'Director eliminado correctamente'
        });

    } catch (error) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({
                mensaje: 'No se puede eliminar el director porque esta asociado a una pelicula o serie'
            });
        }

        res.status(500).json({
            mensaje: 'Error al eliminar el director',
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