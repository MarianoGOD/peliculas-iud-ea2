import { useEffect, useState } from 'react';
import api from '../services/api';
import Swal from 'sweetalert2';

function Medias() {

    const formularioInicial = {
        serial_media: '',
        titulo: '',
        sinopsis: '',
        url_media: '',
        imagen_portada: '',
        anio_estreno: '',
        id_genero: '',
        id_director: '',
        id_productora: '',
        id_tipo: ''
    };

    const [medias, setMedias] = useState([]);
    const [generos, setGeneros] = useState([]);
    const [directores, setDirectores] = useState([]);
    const [productoras, setProductoras] = useState([]);
    const [tipos, setTipos] = useState([]);

    const [formulario, setFormulario] = useState(formularioInicial);
    const [editando, setEditando] = useState(null);
    const [cargando, setCargando] = useState(true);

    // Consultar las producciones y las opciones
    const cargarDatos = async () => {
        try {
            setCargando(true);

            const respuestas = await Promise.all([
                api.get('/medias'),
                api.get('/generos'),
                api.get('/directores'),
                api.get('/productoras'),
                api.get('/tipos')
            ]);

            setMedias(respuestas[0].data);

            setGeneros(
                respuestas[1].data.filter(item => item.estado === 'Activo')
            );

            setDirectores(
                respuestas[2].data.filter(item => item.estado === 'Activo')
            );

            setProductoras(
                respuestas[3].data.filter(item => item.estado === 'Activo')
            );

            setTipos(respuestas[4].data);

        } catch (error) {
            Swal.fire(
                'Error',
                'No se pudo cargar la informacion de las producciones',
                'error'
            );
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    // Manejar los cambios del formulario
    const manejarCambio = (e) => {
        const { name, value } = e.target;

        setFormulario({
            ...formulario,
            [name]: value
        });
    };

    // Limpiar el formulario
    const limpiarFormulario = () => {
        setFormulario(formularioInicial);
        setEditando(null);
    };

    // Registrar o actualizar una produccion
    const guardar = async (e) => {
        e.preventDefault();

        const datos = {
            ...formulario,
            anio_estreno: Number(formulario.anio_estreno),
            id_genero: Number(formulario.id_genero),
            id_director: Number(formulario.id_director),
            id_productora: Number(formulario.id_productora),
            id_tipo: Number(formulario.id_tipo),
            sinopsis: formulario.sinopsis || null,
            imagen_portada: formulario.imagen_portada || null
        };

        try {
            if (editando !== null) {

                await api.put(`/medias/${editando}`, datos);

                await Swal.fire(
                    'Actualizado',
                    'La produccion se actualizo correctamente',
                    'success'
                );

            } else {

                await api.post('/medias', datos);

                await Swal.fire(
                    'Registrado',
                    'La produccion se registro correctamente',
                    'success'
                );
            }

            limpiarFormulario();
            await cargarDatos();

        } catch (error) {
            const mensaje = error.response?.data?.mensaje ||
                'No se pudo guardar la produccion';

            Swal.fire('Error', mensaje, 'error');
        }
    };

    // Cargar los datos de una produccion para editar
    const editar = (media) => {

        setFormulario({
            serial_media: media.serial_media,
            titulo: media.titulo,
            sinopsis: media.sinopsis || '',
            url_media: media.url_media,
            imagen_portada: media.imagen_portada || '',
            anio_estreno: media.anio_estreno,
            id_genero: media.id_genero,
            id_director: media.id_director,
            id_productora: media.id_productora,
            id_tipo: media.id_tipo
        });

        setEditando(media.id_media);

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Eliminar una produccion
    const eliminar = async (id) => {

        const confirmacion = await Swal.fire({
            title: 'Eliminar produccion',
            text: '¿Estas seguro de eliminar este registro?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (confirmacion.isConfirmed) {

            try {
                await api.delete(`/medias/${id}`);

                await Swal.fire(
                    'Eliminado',
                    'La produccion fue eliminada correctamente',
                    'success'
                );

                await cargarDatos();

            } catch (error) {
                const mensaje = error.response?.data?.mensaje ||
                    'No se pudo eliminar la produccion';

                Swal.fire('Error', mensaje, 'error');
            }
        }
    };

    return (

        <div>

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>
                    <h2 className="page-title">Peliculas y Series</h2>
                    <p className="text-muted">
                        Administracion de producciones audiovisuales
                    </p>
                </div>

                <span className="badge bg-dark fs-6">
                    {medias.length} producciones
                </span>

            </div>

            {/* Formulario */}

            <div className="module-container mb-4">

                <h5 className="mb-4">
                    {editando !== null
                        ? 'Actualizar produccion'
                        : 'Registrar nueva produccion'}
                </h5>

                <form onSubmit={guardar}>

                    <div className="row">

                        <div className="col-md-4 mb-3">
                            <label className="form-label fw-semibold">
                                Serial
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                name="serial_media"
                                value={formulario.serial_media}
                                onChange={manejarCambio}
                                maxLength="50"
                                required
                            />
                        </div>

                        <div className="col-md-8 mb-3">
                            <label className="form-label fw-semibold">
                                Titulo
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                name="titulo"
                                value={formulario.titulo}
                                onChange={manejarCambio}
                                maxLength="200"
                                required
                            />
                        </div>

                        <div className="col-12 mb-3">
                            <label className="form-label fw-semibold">
                                Sinopsis
                            </label>

                            <textarea
                                className="form-control"
                                name="sinopsis"
                                value={formulario.sinopsis}
                                onChange={manejarCambio}
                                rows="3"
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-semibold">
                                URL de la pelicula o serie
                            </label>

                            <input
                                type="url"
                                className="form-control"
                                name="url_media"
                                value={formulario.url_media}
                                onChange={manejarCambio}
                                maxLength="500"
                                placeholder="https://ejemplo.com"
                                required
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-semibold">
                                Imagen de portada
                            </label>

                            <input
                                type="url"
                                className="form-control"
                                name="imagen_portada"
                                value={formulario.imagen_portada}
                                onChange={manejarCambio}
                                maxLength="500"
                                placeholder="https://ejemplo.com/imagen.jpg"
                            />
                        </div>

                        <div className="col-md-4 mb-3">
                            <label className="form-label fw-semibold">
                                Año de estreno
                            </label>

                            <input
                                type="number"
                                className="form-control"
                                name="anio_estreno"
                                value={formulario.anio_estreno}
                                onChange={manejarCambio}
                                min="1"
                                max="65535"
                                required
                            />
                        </div>

                        <div className="col-md-4 mb-3">
                            <label className="form-label fw-semibold">
                                Genero
                            </label>

                            <select
                                className="form-select"
                                name="id_genero"
                                value={formulario.id_genero}
                                onChange={manejarCambio}
                                required
                            >
                                <option value="">Seleccionar genero</option>

                                {generos.map(genero => (
                                    <option
                                        key={genero.id_genero}
                                        value={genero.id_genero}
                                    >
                                        {genero.nombre}
                                    </option>
                                ))}

                            </select>
                        </div>

                        <div className="col-md-4 mb-3">
                            <label className="form-label fw-semibold">
                                Director
                            </label>

                            <select
                                className="form-select"
                                name="id_director"
                                value={formulario.id_director}
                                onChange={manejarCambio}
                                required
                            >
                                <option value="">Seleccionar director</option>

                                {directores.map(director => (
                                    <option
                                        key={director.id_director}
                                        value={director.id_director}
                                    >
                                        {director.nombres}
                                    </option>
                                ))}

                            </select>
                        </div>

                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-semibold">
                                Productora
                            </label>

                            <select
                                className="form-select"
                                name="id_productora"
                                value={formulario.id_productora}
                                onChange={manejarCambio}
                                required
                            >
                                <option value="">Seleccionar productora</option>

                                {productoras.map(productora => (
                                    <option
                                        key={productora.id_productora}
                                        value={productora.id_productora}
                                    >
                                        {productora.nombre}
                                    </option>
                                ))}

                            </select>
                        </div>

                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-semibold">
                                Tipo de contenido
                            </label>

                            <select
                                className="form-select"
                                name="id_tipo"
                                value={formulario.id_tipo}
                                onChange={manejarCambio}
                                required
                            >
                                <option value="">Seleccionar tipo</option>

                                {tipos.map(tipo => (
                                    <option
                                        key={tipo.id_tipo}
                                        value={tipo.id_tipo}
                                    >
                                        {tipo.nombre}
                                    </option>
                                ))}

                            </select>
                        </div>

                    </div>

                    <button type="submit" className="btn btn-danger me-2">
                        {editando !== null
                            ? 'Guardar cambios'
                            : 'Registrar produccion'}
                    </button>

                    {editando !== null && (
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={limpiarFormulario}
                        >
                            Cancelar
                        </button>
                    )}

                </form>

            </div>

            {/* Tabla de producciones */}

            <div className="module-container">

                <h5 className="mb-4">Producciones registradas</h5>

                {cargando ? (

                    <p>Cargando informacion...</p>

                ) : (

                    <div className="table-responsive">

                        <table className="table table-hover align-middle">

                            <thead className="table-dark">
                                <tr>
                                    <th>Serial</th>
                                    <th>Titulo</th>
                                    <th>Año</th>
                                    <th>Genero</th>
                                    <th>Director</th>
                                    <th>Productora</th>
                                    <th>Tipo</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>

                            <tbody>

                                {medias.length === 0 ? (

                                    <tr>
                                        <td colSpan="8" className="text-center">
                                            No hay producciones registradas
                                        </td>
                                    </tr>

                                ) : (

                                    medias.map(media => (

                                        <tr key={media.id_media}>

                                            <td>{media.serial_media}</td>
                                            <td>{media.titulo}</td>
                                            <td>{media.anio_estreno}</td>
                                            <td>{media.nombre_genero}</td>
                                            <td>{media.nombre_director}</td>
                                            <td>{media.nombre_productora}</td>
                                            <td>{media.nombre_tipo}</td>

                                            <td>
                                                <button
                                                    className="btn btn-sm btn-warning me-2"
                                                    onClick={() => editar(media)}
                                                >
                                                    Editar
                                                </button>

                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => eliminar(media.id_media)}
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

export default Medias;