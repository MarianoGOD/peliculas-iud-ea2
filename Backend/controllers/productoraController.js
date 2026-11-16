const productoraModel = require('../models/productoraModel');

// Consultar todas las productoras
const obtenerTodas = async (req, res) => {
    try {
        const productoras = await productoraModel.obtenerTodas();

        res.json(productoras);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al consultar las productoras',
            error: error.message
        });
    }
};

// Consultar una productora por su ID
const obtenerPorId = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: 'El ID de la productora no es valido'
            });
        }

        const productora = await productoraModel.obtenerPorId(id);

        if (!productora) {
            return res.status(404).json({
                mensaje: 'Productora no encontrada'
            });
        }

        res.json(productora);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al consultar la productora',
            error: error.message
        });
    }
};

// Registrar una productora
const crear = async (req, res) => {
    try {
        const { nombre, estado, slogan, descripcion } = req.body;

        if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
            return res.status(400).json({
                mensaje: 'El nombre de la productora es obligatorio'
            });
        }

        const estadoFinal = estado || 'Activo';

        if (!['Activo', 'Inactivo'].includes(estadoFinal)) {
            return res.status(400).json({
                mensaje: 'El estado debe ser Activo o Inactivo'
            });
        }

        const id = await productoraModel.crear(
            nombre.trim(),
            estadoFinal,
            slogan || null,
            descripcion || null
        );

        res.status(201).json({
            mensaje: 'Productora registrada correctamente',
            id_productora: id
        });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                mensaje: 'Ya existe una productora con ese nombre'
            });
        }

        res.status(500).json({
            mensaje: 'Error al registrar la productora',
            error: error.message
        });
    }
};

// Actualizar una productora
const actualizar = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { nombre, estado, slogan, descripcion } = req.body;

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: 'El ID de la productora no es valido'
            });
        }

        if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
            return res.status(400).json({
                mensaje: 'El nombre de la productora es obligatorio'
            });
        }

        if (!['Activo', 'Inactivo'].includes(estado)) {
            return res.status(400).json({
                mensaje: 'El estado debe ser Activo o Inactivo'
            });
        }

        const productora = await productoraModel.obtenerPorId(id);

        if (!productora) {
            return res.status(404).json({
                mensaje: 'Productora no encontrada'
            });
        }

        await productoraModel.actualizar(
            id,
            nombre.trim(),
            estado,
            slogan || null,
            descripcion || null
        );

        res.json({
            mensaje: 'Productora actualizada correctamente'
        });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                mensaje: 'Ya existe una productora con ese nombre'
            });
        }

        res.status(500).json({
            mensaje: 'Error al actualizar la productora',
            error: error.message
        });
    }
};

// Eliminar una productora
const eliminar = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: 'El ID de la productora no es valido'
            });
        }

        const productora = await productoraModel.obtenerPorId(id);

        if (!productora) {
            return res.status(404).json({
                mensaje: 'Productora no encontrada'
            });
        }

        await productoraModel.eliminar(id);

        res.json({
            mensaje: 'Productora eliminada correctamente'
        });

    } catch (error) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({
                mensaje: 'No se puede eliminar la productora porque esta asociada a una pelicula o serie'
            });
        }

        res.status(500).json({
            mensaje: 'Error al eliminar la productora',
            error: error.message
        });
    }
};

module.exports = {
    obtenerTodas,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};