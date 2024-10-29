import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../axiosConfig';

const ConfirmarRestablecimiento = () => {
  const { uidb64, token } = useParams();  // Captura los parámetros de la URL
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handlePasswordReset = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("Las contraseñas no coinciden.");
      return;
    }

    api.post(`/auth/password-reset-confirm/${uidb64}/${token}/`, { new_password: newPassword })
      .then(response => {
        setMessage("Contraseña restablecida con éxito.");
        setTimeout(() => navigate('/login'), 2000);  // Redirigir tras unos segundos
      })
      .catch(error => {
        console.error("Error al restablecer la contraseña:", error);
        setMessage("El enlace es inválido o ha expirado.");
      });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Restablecer Contraseña</h2>
        <form onSubmit={handlePasswordReset}>
          <label>Nueva Contraseña</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <label>Confirmar Contraseña</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">Restablecer Contraseña</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default ConfirmarRestablecimiento;
