import React, { useState } from 'react';
import api from '../axiosConfig';
import './Modal.css';

const CambiarContrasena = ({ onClose }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");

  const handleSavePassword = () => {
    if (nuevaContrasena !== confirmarContrasena) {
      alert("Las contraseñas no coinciden");
      return;
    }

    // Llamada a la API para cambiar la contraseña (el token se maneja en axiosConfig)
    api.put('auth/change-password/', {
      old_password: oldPassword,
      new_password: nuevaContrasena
    })
    .then(response => {
      alert("Contraseña actualizada exitosamente");
      onClose();
    })
    .catch(error => {
      console.error("Error al actualizar la contraseña:", error.response || error);
      alert("Hubo un problema al actualizar la contraseña");
    });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <button className="close" onClick={onClose}>×</button>
        <h2>Cambiar Contraseña</h2>
        
        <label>Contraseña Actual</label>
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />

        <label>Nueva Contraseña</label>
        <input
          type="password"
          value={nuevaContrasena}
          onChange={(e) => setNuevaContrasena(e.target.value)}
        />
        
        <label>Confirmar Nueva Contraseña</label>
        <input
          type="password"
          value={confirmarContrasena}
          onChange={(e) => setConfirmarContrasena(e.target.value)}
        />
        
        <div className="button-container">
          <button onClick={handleSavePassword}>Guardar</button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default CambiarContrasena;


