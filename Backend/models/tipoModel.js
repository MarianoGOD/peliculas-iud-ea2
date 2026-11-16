const conexion = require('../config/db');

// Consultar todos los tipos
const obtenerTodos = async () => {
    const [resultado] = await conexion.query(
        'SELECT * FROM tipos ORDER BY id_tipo ASC'
    );

    return resultado;
};

// Consultar un tipo por su ID
const obtenerPorId = async (id) => {
    const [resultado] = await conexion.query(
        'SELECT * FROM tipos WHERE id_tipo = ?',
        [id]
    );

    return resultado[0];
};

// Registrar un tipo
const crear = async (nombre, descripcion) => {
    const [resultado] = await conexion.query(
        'INSERT INTO tipos (nombre, descripcion) VALUES (?, ?)',
        [nombre, descripcion]
    );

    return resultado.insertId;
};

// Actualizar un tipo
const actualizar = async (id, nombre, descripcion) => {
    const [resultado] = await conexion.query(
        'UPDATE tipos SET nombre = ?, descripcion = ? WHERE id_tipo = ?',
        [nombre, descripcion, id]
    );

    return resultado.affectedRows;
};

// Eliminar un tipo
const eliminar = async (id) => {
    const [resultado] = await conexion.query(
        'DELETE FROM tipos WHERE id_tipo = ?',
        [id]
    );

    return resultado.affectedRows;
};

module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};