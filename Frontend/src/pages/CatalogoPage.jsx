import GestionCatalogo from '../components/GestionCatalogo';

const configuraciones = {

    generos: {
        titulo: 'Generos',
        endpoint: '/generos',
        idCampo: 'id_genero',

        campos: [
            { name: 'nombre', label: 'Nombre', required: true },
            {
                name: 'estado',
                label: 'Estado',
                type: 'select',
                options: ['Activo', 'Inactivo'],
                required: true
            },
            { name: 'descripcion', label: 'Descripcion', type: 'textarea' }
        ],

        columnas: [
            { campo: 'id_genero', nombre: 'ID' },
            { campo: 'nombre', nombre: 'Nombre' },
            { campo: 'estado', nombre: 'Estado' },
            { campo: 'descripcion', nombre: 'Descripcion' }
        ]
    },

    directores: {
        titulo: 'Directores',
        endpoint: '/directores',
        idCampo: 'id_director',

        campos: [
            { name: 'nombres', label: 'Nombres', required: true },
            {
                name: 'estado',
                label: 'Estado',
                type: 'select',
                options: ['Activo', 'Inactivo'],
                required: true
            }
        ],

        columnas: [
            { campo: 'id_director', nombre: 'ID' },
            { campo: 'nombres', nombre: 'Nombres' },
            { campo: 'estado', nombre: 'Estado' }
        ]
    },

    productoras: {
        titulo: 'Productoras',
        endpoint: '/productoras',
        idCampo: 'id_productora',

        campos: [
            { name: 'nombre', label: 'Nombre', required: true },
            {
                name: 'estado',
                label: 'Estado',
                type: 'select',
                options: ['Activo', 'Inactivo'],
                required: true
            },
            { name: 'slogan', label: 'Slogan' },
            { name: 'descripcion', label: 'Descripcion', type: 'textarea' }
        ],

        columnas: [
            { campo: 'id_productora', nombre: 'ID' },
            { campo: 'nombre', nombre: 'Nombre' },
            { campo: 'estado', nombre: 'Estado' },
            { campo: 'slogan', nombre: 'Slogan' }
        ]
    },

    tipos: {
        titulo: 'Tipos',
        endpoint: '/tipos',
        idCampo: 'id_tipo',

        campos: [
            { name: 'nombre', label: 'Nombre', required: true },
            { name: 'descripcion', label: 'Descripcion', type: 'textarea' }
        ],

        columnas: [
            { campo: 'id_tipo', nombre: 'ID' },
            { campo: 'nombre', nombre: 'Nombre' },
            { campo: 'descripcion', nombre: 'Descripcion' }
        ]
    }
};

function CatalogoPage({ modulo }) {
    const configuracion = configuraciones[modulo];

    return <GestionCatalogo {...configuracion} />;
}

export default CatalogoPage;