import React, { useState } from 'react';
import api from '../axiosConfig';
import { useNavigate } from 'react-router-dom';

const RecuperarContrasena = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Hook para redirigir
  const handleClose = () => {navigate('/');};
  const handlePasswordReset = (e) => {
    e.preventDefault();

    api.post('/auth/password-reset/', { email })
      .then(response => {
        setMessage("Se ha enviado un enlace de recuperación a tu correo electrónico.");
      })
      .catch(error => {
        console.error("Error al solicitar restablecimiento de contraseña:", error);
        setMessage("No se pudo enviar el enlace de recuperación. Por favor verifica tu correo.");
      });
  };

  

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <button className="close" onClick={handleClose}>×</button>
        <h2>Recuperar Contraseña</h2>
        <form onSubmit={handlePasswordReset}>
          <label>Correo Electrónico</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Enviar enlace de recuperación</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default RecuperarContrasena;
