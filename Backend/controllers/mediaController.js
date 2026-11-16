const mediaModel = require('../models/mediaModel');

// Validar los datos de una pelicula o serie
const validarDatos = (media) => {

    if (!media.serial_media || typeof media.serial_media !== 'string' || media.serial_media.trim() === '') {
        return 'El serial es obligatorio';
    }

    if (media.serial_media.trim().length > 50) {
        return 'El serial no puede superar los 50 caracteres';
    }

    if (!media.titulo || typeof media.titulo !== 'string' || media.titulo.trim() === '') {
        return 'El titulo es obligatorio';
    }

    if (media.titulo.trim().length > 200) {
        return 'El titulo no puede superar los 200 caracteres';
    }

    if (!media.url_media || typeof media.url_media !== 'string' || media.url_media.trim() === '') {
        return 'La URL de la produccion es obligatoria';
    }

    if (media.url_media.trim().length > 500) {
        return 'La URL no puede superar los 500 caracteres';
    }

    if (
        media.sinopsis !== undefined &&
        media.sinopsis !== null &&
        typeof media.sinopsis !== 'string'
    ) {
        return 'La sinopsis debe ser un texto';
    }

    if (
        media.imagen_portada !== undefined &&
        media.imagen_portada !== null &&
        typeof media.imagen_portada !== 'string'
    ) {
        return 'La imagen de portada debe ser una URL o ruta de texto';
    }

    if (
        media.imagen_portada &&
        media.imagen_portada.trim().length > 500
    ) {
        return 'La imagen de portada no puede superar los 500 caracteres';
    }

    const anio = Number(media.anio_estreno);

    if (!Number.isInteger(anio) || anio <= 0 || anio > 65535) {
        return 'El año de estreno no es valido';
    }

    const ids = [
        media.id_genero,
        media.id_director,
        media.id_productora,
        media.id_tipo
    ];

    for (const id of ids) {
        if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
            return 'Los identificadores de genero, director, productora y tipo son obligatorios y deben ser validos';
        }
    }

    return null;
};

// Organizar los datos recibidos
const prepararDatos = (media) => {
    return {
        serial_media: media.serial_media.trim(),
        titulo: media.titulo.trim(),
        sinopsis: media.sinopsis ? media.sinopsis.trim() : null,
        url_media: media.url_media.trim(),
        imagen_portada: media.imagen_portada ? media.imagen_portada.trim() : null,
        anio_estreno: Number(media.anio_estreno),
        id_genero: Number(media.id_genero),
        id_director: Number(media.id_director),
        id_productora: Number(media.id_productora),
        id_tipo: Number(media.id_tipo)
    };
};

// Validar las relaciones de la produccion
const validarRelaciones = async (media) => {

    const generoActivo = await mediaModel.generoActivo(media.id_genero);

    if (!generoActivo) {
        return 'El genero seleccionado no existe o esta inactivo';
    }

    const directorActivo = await mediaModel.directorActivo(media.id_director);

    if (!directorActivo) {
        return 'El director seleccionado no existe o esta inactivo';
    }

    const productoraActiva = await mediaModel.productoraActiva(media.id_productora);

    if (!productoraActiva) {
        return 'La productora seleccionada no existe o esta inactiva';
    }

    const tipoExiste = await mediaModel.tipoExiste(media.id_tipo);

    if (!tipoExiste) {
        return 'El tipo seleccionado no existe';
    }

    return null;
};

// Consultar todas las peliculas y series
const obtenerTodas = async (req, res) => {
    try {
        const medias = await mediaModel.obtenerTodas();

        res.json(medias);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al consultar las producciones',
            error: error.message
        });
    }
};

// Consultar una pelicula o serie por su ID
const obtenerPorId = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: 'El ID de la produccion no es valido'
            });
        }

        const media = await mediaModel.obtenerPorId(id);

        if (!media) {
            return res.status(404).json({
                mensaje: 'Produccion no encontrada'
            });
        }

        res.json(media);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al consultar la produccion',
            error: error.message
        });
    }
};

// Registrar una pelicula o serie
const crear = async (req, res) => {
    try {
        const errorValidacion = validarDatos(req.body);

        if (errorValidacion) {
            return res.status(400).json({
                mensaje: errorValidacion
            });
        }

        const media = prepararDatos(req.body);

        const errorRelacion = await validarRelaciones(media);

        if (errorRelacion) {
            return res.status(400).json({
                mensaje: errorRelacion
            });
        }

        const id = await mediaModel.crear(media);

        res.status(201).json({
            mensaje: 'Produccion registrada correctamente',
            id_media: id
        });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                mensaje: 'El serial o la URL ya se encuentran registrados'
            });
        }

        res.status(500).json({
            mensaje: 'Error al registrar la produccion',
            error: error.message
        });
    }
};

// Actualizar una pelicula o serie
const actualizar = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: 'El ID de la produccion no es valido'
            });
        }

        const mediaExistente = await mediaModel.obtenerPorId(id);

        if (!mediaExistente) {
            return res.status(404).json({
                mensaje: 'Produccion no encontrada'
            });
        }

        const errorValidacion = validarDatos(req.body);

        if (errorValidacion) {
            return res.status(400).json({
                mensaje: errorValidacion
            });
        }

        const media = prepararDatos(req.body);

        const errorRelacion = await validarRelaciones(media);

        if (errorRelacion) {
            return res.status(400).json({
                mensaje: errorRelacion
            });
        }

        await mediaModel.actualizar(id, media);

        res.json({
            mensaje: 'Produccion actualizada correctamente'
        });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                mensaje: 'El serial o la URL ya se encuentran registrados'
            });
        }

        res.status(500).json({
            mensaje: 'Error al actualizar la produccion',
            error: error.message
        });
    }
};

// Eliminar una pelicula o serie
const eliminar = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: 'El ID de la produccion no es valido'
            });
        }

        const media = await mediaModel.obtenerPorId(id);

        if (!media) {
            return res.status(404).json({
                mensaje: 'Produccion no encontrada'
            });
        }

        await mediaModel.eliminar(id);

        res.json({
            mensaje: 'Produccion eliminada correctamente'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al eliminar la produccion',
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