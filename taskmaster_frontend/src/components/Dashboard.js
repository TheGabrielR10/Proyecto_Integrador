import React, { useEffect, useState } from 'react';
import BarraInicio from './menu/BarraInicio';
import KanbanBoard from './camban/KanbanBoard';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Filtro from './camban/Filtro';

const Dashboard = ({ token }) => {
    const [userInfo, setUserInfo] = useState('');
    const navigate = useNavigate();
    const API_URL = 'http://127.0.0.1:8000/logout/'; // Cambia la URL según tu configuración
    const API_URL_UI ='http://127.0.0.1:8000/api/current-user/'

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get(API_URL_UI, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserInfo(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching user info:', error.data,error.status);

                if (error.status === 401)
                    navigate('/', { replace: true }); // Eliminar página anterior del historial
                    return
            }
        };
        fetchUserInfo();
    }, [token]);
    
    if (!userInfo) {
        return <div>Cargando información del usuariohhh...</div>;
    }

    const handleLogout = async () => {
        const refreshToken = localStorage.getItem('refresh_token');
        const accessToken = localStorage.getItem('access_token');

        if (!refreshToken || !accessToken) {
            navigate('/', { replace: true }); // Eliminar página anterior del historial
            return;
        }

        try {
            await axios.post( API_URL, {
                refresh_token: refreshToken,
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            navigate('/', { replace: true }); // Eliminar página anterior del historial
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            navigate('/', { replace: true }); // Eliminar página anterior del historial
        }
    
    };

    return (
<div className="container-fluid">
        <div className="row">
            <nav className="col-md-2 d-none d-md-block bg-light sidebar">
                <div className="sidebar-sticky">
                    <h4 className="sidebar-heading text-center">Menú</h4>
                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <button className="nav-link btn btn-dark rounded-pill" onClick={() => navigate('/tipoproductos')}>
                                Gestionar tipos de productos
                            </button>
                        </li>
                        <li className="nav-item">
                            <button className="nav-link btn btn-dark rounded-pill" onClick={() => navigate('/ventas')}>
                                Gestionar Productos
                            </button>
                        </li>
                    </ul>
                </div>
            </nav>

            <main className="col-md-9 ms-sm-auto col-lg-10 px-4">
                <div className="d-flex justify-content-between align-items-center">
                    <h3 className="mt-3">tienda en linea </h3>
                    <button className="btn btn-danger rounded-pill" onClick={handleLogout}>
                        Cerrar Sesión
                    </button>
                </div>
                <div className="card mt-4">
                    <div className="card-body">
                        <h2>Bienvenido, {userInfo.nombre} {userInfo.apellido}</h2>
                        <p><strong>Username:</strong> {userInfo.username}</p>
                        <p><strong>Estado:</strong> {userInfo.estado ? 'Activo' : 'Inactivo'}</p>
                    </div>
                </div>
            </main>
        </div>
    </div>
    );
};


export default Dashboard;