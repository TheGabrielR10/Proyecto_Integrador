// src/components/LoginForm.js
import React, { useState } from 'react';
import axiosInstance from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';


const LoginForm = ({ setToken }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const API_URL = 'http://localhost:8000/api/auth/token/';

    const handleLogin = async () => {
        try {
            const response = await axiosInstance.post(API_URL, { email, password });
            console.log(response.data);
            setToken(response.data.access); // Aquí se establece el token
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);

            navigate('/KanbanBoard'); // Redirige al usuario a la página de KanbanBoard
        } catch (error) {
            alert('Login fallido');
            console.log(error);
        }
    };

    const handlePasswordReset = () => {
        navigate('/recuperar');
    };

    const handleRegistro = () => {
        navigate('/registro');
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2 className="taskmaster-title">TaskMaster</h2>
                <div className="login-icon">
                    <i className="fas fa-user-circle"></i>
                </div>
                <div className="form-group">
                    <input 
                        type="email" 
                        placeholder="Correo" 
                        onChange={(e) => setEmail(e.target.value)} 
                        className="form-control mb-3" 
                    />
                </div>
                <div className="form-group">
                    <input 
                        type="password" 
                        placeholder="Contraseña" 
                        onChange={(e) => setPassword(e.target.value)} 
                        className="form-control mb-3" 
                    />
                </div>
                <button onClick={handleLogin} className="btn btn-primary btn-block">
                    Iniciar Sesión
                </button>
                <button onClick={handlePasswordReset} className="btn btn-link btn-forgot-password">
                    ¿Olvidaste tu contraseña?
                </button>
                <button onClick={handleRegistro} className="btn btn-link btn-forgot-password">
                    Registrarse
                </button>
            </div>
        </div>
    );
};

export default LoginForm;

