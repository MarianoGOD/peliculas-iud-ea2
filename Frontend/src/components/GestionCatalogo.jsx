import { useEffect, useState } from 'react';
import api from '../services/api';
import Swal from 'sweetalert2';

function GestionCatalogo({ titulo, endpoint, idCampo, campos, columnas }) {

    const obtenerFormularioVacio = () => {
        const datos = {};

        campos.forEach((campo) => {
            datos[campo.name] = '';
        });

        return datos;
    };

    const [registros, setRegistros] = useState([]);
    const [formulario, setFormulario] = useState(obtenerFormularioVacio());
    const [editando, setEditando] = useState(null);
    const [cargando, setCargando] = useState(false);

    // Consultar los registros
    const cargarDatos = async () => {
        try {
            setCargando(true);
            const respuesta = await api.get(endpoint);
            setRegistros(respuesta.data);
        } catch (error) {
            Swal.fire('Error', 'No se pudieron consultar los registros', 'error');
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, [endpoint]);

    // Manejar los campos del formulario
    const manejarCambio = (e) => {
        const { name, value } = e.target;

        setFormulario({
            ...formulario,
            [name]: value
        });
    };

    // Guardar o actualizar
    const guardar = async (e) => {
        e.preventDefault();

        try {
            if (editando !== null) {
                await api.put(`${endpoint}/${editando}`, formulario);

                await Swal.fire(
                    'Actualizado',
                    'El registro se actualizo correctamente',
                    'success'
                );
            } else {
                await api.post(endpoint, formulario);

                await Swal.fire(
                    'Registrado',
                    'El registro se guardo correctamente',
                    'success'
                );
            }

            cancelarEdicion();
            cargarDatos();

        } catch (error) {
            const mensaje = error.response?.data?.mensaje || 'No se pudo guardar la informacion';

            Swal.fire('Error', mensaje, 'error');
        }
    };

    // Cargar informacion para editar
    const editarRegistro = (registro) => {
        const datos = {};

        campos.forEach((campo) => {
            datos[campo.name] = registro[campo.name] ?? '';
        });

        setFormulario(datos);
        setEditando(registro[idCampo]);

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Limpiar formulario
    const cancelarEdicion = () => {
        setFormulario(obtenerFormularioVacio());
        setEditando(null);
    };

    // Eliminar registro
    const eliminarRegistro = async (id) => {
        const confirmacion = await Swal.fire({
            title: '¿Estas seguro?',
            text: 'Esta accion no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (confirmacion.isConfirmed) {
            try {
                await api.delete(`${endpoint}/${id}`);

                await Swal.fire(
                    'Eliminado',
                    'El registro fue eliminado correctamente',
                    'success'
                );

                cargarDatos();

            } catch (error) {
                const mensaje = error.response?.data?.mensaje || 'No se pudo eliminar el registro';

                Swal.fire('Error', mensaje, 'error');
            }
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="page-title">{titulo}</h2>
                    <p className="text-muted">Administracion de registros</p>
                </div>

                <span className="badge bg-dark fs-6">
                    {registros.length} registros
                </span>
            </div>

            {/* Formulario */}
            <div className="module-container mb-4">
                <h5 className="mb-4">
                    {editando !== null ? 'Actualizar registro' : 'Registrar nuevo'}
                </h5>

                <form onSubmit={guardar}>
                    <div className="row">

                        {campos.map((campo) => (
                            <div className="col-md-6 mb-3" key={campo.name}>

                                <label className="form-label fw-semibold">
                                    {campo.label}
                                </label>

                                {campo.type === 'select' ? (
                                    <select
                                        className="form-select"
                                        name={campo.name}
                                        value={formulario[campo.name]}
                                        onChange={manejarCambio}
                                        required={campo.required}
                                    >
                                        <option value="">Seleccionar</option>

                                        {campo.options.map((opcion) => (
                                            <option key={opcion} value={opcion}>
                                                {opcion}
                                            </option>
                                        ))}
                                    </select>
                                ) : campo.type === 'textarea' ? (
                                    <textarea
                                        className="form-control"
                                        name={campo.name}
                                        value={formulario[campo.name]}
                                        onChange={manejarCambio}
                                        required={campo.required}
                                        rows="3"
                                    />
                                ) : (
                                    <input
                                        className="form-control"
                                        type="text"
                                        name={campo.name}
                                        value={formulario[campo.name]}
                                        onChange={manejarCambio}
                                        required={campo.required}
                                    />
                                )}

                            </div>
                        ))}

                    </div>

                    <button type="submit" className="btn btn-danger me-2">
                        {editando !== null ? 'Guardar cambios' : 'Registrar'}
                    </button>

                    {editando !== null && (
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={cancelarEdicion}
                        >
                            Cancelar
                        </button>
                    )}

                </form>
            </div>

            {/* Tabla de registros */}
            <div className="module-container">
                <h5 className="mb-4">Registros existentes</h5>

                {cargando ? (
                    <p>Cargando informacion...</p>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">

                            <thead className="table-dark">
                                <tr>
                                    {columnas.map((columna) => (
                                        <th key={columna.campo}>
                                            {columna.nombre}
                                        </th>
                                    ))}

                                    <th>Acciones</th>
                                </tr>
                            </thead>

                            <tbody>
                                {registros.length === 0 ? (
                                    <tr>
                                        <td colSpan={columnas.length + 1} className="text-center">
                                            No hay registros disponibles
                                        </td>
                                    </tr>
                                ) : (
                                    registros.map((registro) => (
                                        <tr key={registro[idCampo]}>

                                            {columnas.map((columna) => (
                                                <td key={columna.campo}>
                                                    {registro[columna.campo] || '-'}
                                                </td>
                                            ))}

                                            <td>
                                                <button
                                                    className="btn btn-sm btn-warning me-2"
                                                    onClick={() => editarRegistro(registro)}
                                                >
                                                    Editar
                                                </button>

                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => eliminarRegistro(registro[idCampo])}
                                                >
                                                    Eliminar
                                                </button>
                                            </td>

                                        </tr>
                                    ))
                                )}
                            </tbody>

                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default GestionCatalogo;