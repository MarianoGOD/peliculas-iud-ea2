const conexion = require('../config/db');

// Consultar todas las peliculas y series
const obtenerTodas = async () => {
    const [resultado] = await conexion.query(`
        SELECT 
            m.*,
            g.nombre AS nombre_genero,
            d.nombres AS nombre_director,
            p.nombre AS nombre_productora,
            t.nombre AS nombre_tipo
        FROM medias m
        INNER JOIN generos g ON m.id_genero = g.id_genero
        INNER JOIN directores d ON m.id_director = d.id_director
        INNER JOIN productoras p ON m.id_productora = p.id_productora
        INNER JOIN tipos t ON m.id_tipo = t.id_tipo
        ORDER BY m.id_media ASC
    `);

    return resultado;
};

// Consultar una produccion por su ID
const obtenerPorId = async (id) => {
    const [resultado] = await conexion.query(`
        SELECT 
            m.*,
            g.nombre AS nombre_genero,
            d.nombres AS nombre_director,
            p.nombre AS nombre_productora,
            t.nombre AS nombre_tipo
        FROM medias m
        INNER JOIN generos g ON m.id_genero = g.id_genero
        INNER JOIN directores d ON m.id_director = d.id_director
        INNER JOIN productoras p ON m.id_productora = p.id_productora
        INNER JOIN tipos t ON m.id_tipo = t.id_tipo
        WHERE m.id_media = ?
    `, [id]);

    return resultado[0];
};

// Consultar si un genero esta activo
const generoActivo = async (id) => {
    const [resultado] = await conexion.query(
        "SELECT id_genero FROM generos WHERE id_genero = ? AND estado = 'Activo'",
        [id]
    );

    return resultado.length > 0;
};

// Consultar si un director esta activo
const directorActivo = async (id) => {
    const [resultado] = await conexion.query(
        "SELECT id_director FROM directores WHERE id_director = ? AND estado = 'Activo'",
        [id]
    );

    return resultado.length > 0;
};

// Consultar si una productora esta activa
const productoraActiva = async (id) => {
    const [resultado] = await conexion.query(
        "SELECT id_productora FROM productoras WHERE id_productora = ? AND estado = 'Activo'",
        [id]
    );

    return resultado.length > 0;
};

// Consultar si el tipo existe
const tipoExiste = async (id) => {
    const [resultado] = await conexion.query(
        'SELECT id_tipo FROM tipos WHERE id_tipo = ?',
        [id]
    );

    return resultado.length > 0;
};

// Registrar una pelicula o serie
const crear = async (media) => {
    const {
        serial_media,
        titulo,
        sinopsis,
        url_media,
        imagen_portada,
        anio_estreno,
        id_genero,
        id_director,
        id_productora,
        id_tipo
    } = media;

    const [resultado] = await conexion.query(
        `INSERT INTO medias
        (serial_media, titulo, sinopsis, url_media, imagen_portada,
        anio_estreno, id_genero, id_director, id_productora, id_tipo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            serial_media,
            titulo,
            sinopsis,
            url_media,
            imagen_portada,
            anio_estreno,
            id_genero,
            id_director,
            id_productora,
            id_tipo
        ]
    );

    return resultado.insertId;
};

// Actualizar una pelicula o serie
const actualizar = async (id, media) => {
    const {
        serial_media,
        titulo,
        sinopsis,
        url_media,
        imagen_portada,
        anio_estreno,
        id_genero,
        id_director,
        id_productora,
        id_tipo
    } = media;

    const [resultado] = await conexion.query(
        `UPDATE medias SET
        serial_media = ?,
        titulo = ?,
        sinopsis = ?,
        url_media = ?,
        imagen_portada = ?,
        anio_estreno = ?,
        id_genero = ?,
        id_director = ?,
        id_productora = ?,
        id_tipo = ?
        WHERE id_media = ?`,
        [
            serial_media,
            titulo,
            sinopsis,
            url_media,
            imagen_portada,
            anio_estreno,
            id_genero,
            id_director,
            id_productora,
            id_tipo,
            id
        ]
    );

    return resultado.affectedRows;
};

// Eliminar una pelicula o serie
const eliminar = async (id) => {
    const [resultado] = await conexion.query(
        'DELETE FROM medias WHERE id_media = ?',
        [id]
    );

    return resultado.affectedRows;
};

module.exports = {
    obtenerTodas,
    obtenerPorId,
    generoActivo,
    directorActivo,
    productoraActiva,
    tipoExiste,
    crear,
    actualizar,
    eliminar
};