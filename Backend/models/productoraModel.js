const conexion = require('../config/db');

// Consultar todas las productoras
const obtenerTodas = async () => {
    const [resultado] = await conexion.query(
        'SELECT * FROM productoras ORDER BY id_productora ASC'
    );

    return resultado;
};

// Consultar una productora por su ID
const obtenerPorId = async (id) => {
    const [resultado] = await conexion.query(
        'SELECT * FROM productoras WHERE id_productora = ?',
        [id]
    );

    return resultado[0];
};

// Registrar una productora
const crear = async (nombre, estado, slogan, descripcion) => {
    const [resultado] = await conexion.query(
        'INSERT INTO productoras (nombre, estado, slogan, descripcion) VALUES (?, ?, ?, ?)',
        [nombre, estado, slogan, descripcion]
    );

    return resultado.insertId;
};

// Actualizar una productora
const actualizar = async (id, nombre, estado, slogan, descripcion) => {
    const [resultado] = await conexion.query(
        'UPDATE productoras SET nombre = ?, estado = ?, slogan = ?, descripcion = ? WHERE id_productora = ?',
        [nombre, estado, slogan, descripcion, id]
    );

    return resultado.affectedRows;
};

// Eliminar una productora
const eliminar = async (id) => {
    const [resultado] = await conexion.query(
        'DELETE FROM productoras WHERE id_productora = ?',
        [id]
    );

    return resultado.affectedRows;
};

module.exports = {
    obtenerTodas,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};