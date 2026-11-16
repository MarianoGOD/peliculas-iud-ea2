import CatalogoPage from './pages/CatalogoPage';
import { NavLink, Switch, Route, Redirect } from 'react-router-dom';
import './App.css';
import Medias from './pages/Medias';
// Menu principal
const menu = [
    { nombre: 'Inicio', ruta: '/inicio', icono: '⌂' },
    { nombre: 'Generos', ruta: '/generos', icono: '▤' },
    { nombre: 'Directores', ruta: '/directores', icono: '♙' },
    { nombre: 'Productoras', ruta: '/productoras', icono: '▣' },
    { nombre: 'Tipos', ruta: '/tipos', icono: '▦' },
    { nombre: 'Peliculas y Series', ruta: '/medias', icono: '▶' }
];

// Pagina de inicio
const Inicio = () => (
    <div>
        <h2 className="page-title">Panel principal</h2>
        <p className="text-muted">
            Bienvenido al sistema de administracion de peliculas.
        </p>

        <div className="row g-4 mt-3">
            {menu.slice(1).map((item) => (
                <div className="col-md-6 col-xl-4" key={item.ruta}>
                    <div className="dashboard-card">
                        <div className="card-icon">{item.icono}</div>
                        <h5>{item.nombre}</h5>
                        <p>Administrar registros de {item.nombre.toLowerCase()}.</p>
                        <NavLink to={item.ruta} className="btn btn-dark">
                            Ingresar
                        </NavLink>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// Pantalla temporal para los modulos
const Modulo = ({ titulo }) => (
    <div className="module-container">
        <h2 className="page-title">{titulo}</h2>
        <p className="text-muted">
            En esta seccion administraremos los registros de {titulo.toLowerCase()}.
        </p>
    </div>
);

function App() {
    return (
        <div className="app-container">

            <aside className="sidebar">
                <div className="brand">
                    <span className="brand-icon">▶</span>
                    <div>
                        <h4>Peliculas IUD</h4>
                        <small>Panel administrativo</small>
                    </div>
                </div>

                <div className="menu-title">MENU PRINCIPAL</div>

                <nav className="sidebar-menu">
                    {menu.map((item) => (
                        <NavLink
                            key={item.ruta}
                            to={item.ruta}
                            exact
                            activeClassName="active"
                            className="menu-link"
                        >
                            <span className="menu-icon">{item.icono}</span>
                            {item.nombre}
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    Sistema de gestion audiovisual
                </div>
            </aside>

            <main className="main-content">

                <header className="topbar">
                    <div>
                        <small>ADMINISTRACION / IUD</small>
                        <h5>Gestion de contenido</h5>
                    </div>

                    <span className="status-badge">
                        ● Sistema activo
                    </span>
                </header>

                <section className="content-area">

                    <Switch>
                        <Route exact path="/generos">
    <CatalogoPage modulo="generos" />
</Route>

<Route exact path="/directores">
    <CatalogoPage modulo="directores" />
</Route>

<Route exact path="/productoras">
    <CatalogoPage modulo="productoras" />
</Route>

<Route exact path="/tipos">
    <CatalogoPage modulo="tipos" />
</Route>

<Route exact path="/medias">
    <Medias />
</Route>

                        <Redirect to="/inicio" />
                    </Switch>

                </section>

            </main>
        </div>
    );
}

export default App;