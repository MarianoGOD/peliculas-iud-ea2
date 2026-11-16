const tipoModel = require('../models/tipoModel');

// Consultar todos los tipos
const obtenerTodos = async (req, res) => {
    try {
        const tipos = await tipoModel.obtenerTodos();

        res.json(tipos);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al consultar los tipos',
            error: error.message
        });
    }
};

// Consultar un tipo por su ID
const obtenerPorId = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: 'El ID del tipo no es valido'
            });
        }

        const tipo = await tipoModel.obtenerPorId(id);

        if (!tipo) {
            return res.status(404).json({
                mensaje: 'Tipo no encontrado'
            });
        }

        res.json(tipo);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al consultar el tipo',
            error: error.message
        });
    }
};

// Registrar un tipo
const crear = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;

        if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
            return res.status(400).json({
                mensaje: 'El nombre del tipo es obligatorio'
            });
        }

        const id = await tipoModel.crear(
            nombre.trim(),
            descripcion || null
        );

        res.status(201).json({
            mensaje: 'Tipo registrado correctamente',
            id_tipo: id
        });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                mensaje: 'Ya existe un tipo con ese nombre'
            });
        }

        res.status(500).json({
            mensaje: 'Error al registrar el tipo',
            error: error.message
        });
    }
};

// Actualizar un tipo
const actualizar = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { nombre, descripcion } = req.body;

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: 'El ID del tipo no es valido'
            });
        }

        if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
            return res.status(400).json({
                mensaje: 'El nombre del tipo es obligatorio'
            });
        }

        const tipo = await tipoModel.obtenerPorId(id);

        if (!tipo) {
            return res.status(404).json({
                mensaje: 'Tipo no encontrado'
            });
        }

        await tipoModel.actualizar(
            id,
            nombre.trim(),
            descripcion || null
        );

        res.json({
            mensaje: 'Tipo actualizado correctamente'
        });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                mensaje: 'Ya existe un tipo con ese nombre'
            });
        }

        res.status(500).json({
            mensaje: 'Error al actualizar el tipo',
            error: error.message
        });
    }
};

// Eliminar un tipo
const eliminar = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: 'El ID del tipo no es valido'
            });
        }

        const tipo = await tipoModel.obtenerPorId(id);

        if (!tipo) {
            return res.status(404).json({
                mensaje: 'Tipo no encontrado'
            });
        }

        await tipoModel.eliminar(id);

        res.json({
            mensaje: 'Tipo eliminado correctamente'
        });

    } catch (error) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({
                mensaje: 'No se puede eliminar el tipo porque esta asociado a una pelicula o serie'
            });
        }

        res.status(500).json({
            mensaje: 'Error al eliminar el tipo',
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