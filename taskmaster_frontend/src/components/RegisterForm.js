// src/components/RegisterForm.js
import React, { useState } from 'react';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import './RegisterForm.css';


const RegisterForm = () => {
    const [username, setUsername] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [direccion, setDireccion] = useState('');
    const [cedula, setCedula] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errores, setErrores] = useState('');
    const [mensajeExito, setMensajeExito] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        // Verificar que todos los campos están completos
        if (!username || !nombre || !apellidos || !direccion || !cedula || !email || !password) {
            setErrores('Por favor, complete todos los campos.');
            setMensajeExito('');
            return;
        }

        try {
            // Enviar solicitud de registro
            await axios.post('auth/register/', {
                username,
                nombre,
                apellidos,
                direccion,
                email,
                password,
                cedula,
                estado: true // Ajuste para el campo "estado"
            });

            setMensajeExito('Registro exitoso. Puedes iniciar sesión ahora.');
            setErrores('');// Limpiar campos después del éxito
            setUsername('');
            setNombre('');
            setApellidos('');
            setDireccion('');
            setCedula('');
            setEmail('');
            setPassword('');
            navigate('/');

        } catch (error) {
            console.error('Error en el registro:', error.response?.data || error.message);
            setErrores('Error en el registro, intente de nuevo.');
            setMensajeExito('');
        }
    };

    const handleReturnToLogin = () => {
        navigate('/');
    };

    return (
        <div className="registro-container">
            <div className="registro-form">
                <h2>Crear una cuenta</h2>
                <div className="form-group">
                    <label>Nombre de usuario</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Escriba su nombre de usuario"
                    />
                </div>
                <div className="form-group">
                    <label>Nombres</label>
                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Escriba su nombre"
                    />
                </div>
                <div className="form-group">
                    <label>Apellidos</label>
                    <input
                        type="text"
                        value={apellidos}
                        onChange={(e) => setApellidos(e.target.value)}
                        placeholder="Escriba sus apellidos"
                    />
                </div>
                <div className="form-group">
                    <label>Dirección</label>
                    <input
                        type="text"
                        value={direccion}
                        onChange={(e) => setDireccion(e.target.value)}
                        placeholder="Escriba su dirección"
                    />
                </div>
                <div className="form-group">
                    <label>Cédula</label>
                    <input
                        type="text"
                        value={cedula}
                        onChange={(e) => setCedula(e.target.value)}
                        placeholder="Escriba su cédula"
                    />
                </div>
                <div className="form-group">
                    <label>Correo</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Escriba su correo"
                    />
                </div>
                <div className="form-group">
                    <label>Contraseña</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Escriba su contraseña"
                    />
                </div>
                <button onClick={handleRegister} className="btn btn-primary">
                    Registrar
                </button>
                <button onClick={handleReturnToLogin} className="btn btn-secondary">
                    Iniciar Sesión
                </button>
                {errores && <div className="alert alert-danger mt-3">{errores}</div>}
                {mensajeExito && <div className="alert alert-success mt-3">{mensajeExito}</div>}
            </div>
        </div>
    );
};

export default RegisterForm;
