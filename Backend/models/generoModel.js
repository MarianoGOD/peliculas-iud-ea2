const conexion = require('../config/db');

// Consultar todos los generos
const obtenerTodos = async () => {
    const [resultado] = await conexion.query(
        'SELECT * FROM generos ORDER BY id_genero ASC'
    );

    return resultado;
};

// Consultar un genero por su ID
const obtenerPorId = async (id) => {
    const [resultado] = await conexion.query(
        'SELECT * FROM generos WHERE id_genero = ?',
        [id]
    );

    return resultado[0];
};

// Registrar un genero
const crear = async (nombre, estado, descripcion) => {
    const [resultado] = await conexion.query(
        'INSERT INTO generos (nombre, estado, descripcion) VALUES (?, ?, ?)',
        [nombre, estado, descripcion]
    );

    return resultado.insertId;
};

// Actualizar un genero
const actualizar = async (id, nombre, estado, descripcion) => {
    const [resultado] = await conexion.query(
        'UPDATE generos SET nombre = ?, estado = ?, descripcion = ? WHERE id_genero = ?',
        [nombre, estado, descripcion, id]
    );

    return resultado.affectedRows;
};

// Eliminar un genero
const eliminar = async (id) => {
    const [resultado] = await conexion.query(
        'DELETE FROM generos WHERE id_genero = ?',
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