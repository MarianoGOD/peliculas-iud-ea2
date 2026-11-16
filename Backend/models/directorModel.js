const conexion = require('../config/db');

// Consultar todos los directores
const obtenerTodos = async () => {
    const [resultado] = await conexion.query(
        'SELECT * FROM directores ORDER BY id_director ASC'
    );

    return resultado;
};

// Consultar un director por su ID
const obtenerPorId = async (id) => {
    const [resultado] = await conexion.query(
        'SELECT * FROM directores WHERE id_director = ?',
        [id]
    );

    return resultado[0];
};

// Registrar un director
const crear = async (nombres, estado) => {
    const [resultado] = await conexion.query(
        'INSERT INTO directores (nombres, estado) VALUES (?, ?)',
        [nombres, estado]
    );

    return resultado.insertId;
};

// Actualizar un director
const actualizar = async (id, nombres, estado) => {
    const [resultado] = await conexion.query(
        'UPDATE directores SET nombres = ?, estado = ? WHERE id_director = ?',
        [nombres, estado, id]
    );

    return resultado.affectedRows;
};

// Eliminar un director
const eliminar = async (id) => {
    const [resultado] = await conexion.query(
        'DELETE FROM directores WHERE id_director = ?',
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