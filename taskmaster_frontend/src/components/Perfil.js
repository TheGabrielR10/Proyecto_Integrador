import React, { useState, useEffect } from 'react';
import api from '../axiosConfig';
import './Modal.css';

function Perfil({ onClose, onOpenChangePassword }) {
  const [perfil, setPerfil] = useState({
    username: '',
    nombre: '',
    cedula: '',
    apellidos: '',
    direccion: '',
    email: '',
  });
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Cargar los datos del perfil del usuario actual
    api.get('/auth/current-user/')
      .then(response => {
        setPerfil(response.data);
        setUserId(response.data.id);  // Guarda el ID del usuario
      })
      .catch(error => console.error('Error al cargar el perfil:', error));
  }, []);

  const handleChange = (e) => {
    setPerfil({ ...perfil, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = () => {
    // Verifica que el ID esté disponible antes de hacer la solicitud
    if (userId) {
      api.put(`/auth/users/${userId}/update/`, perfil)
        .then(response => {
          alert('Perfil actualizado con éxito');
          onClose();
        })
        .catch(error => console.error('Error al actualizar el perfil:', error));
    } else {
      console.error('ID de usuario no encontrado');
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <button className="close" onClick={onClose}>×</button>
        <h3>Perfil</h3>

        <label>Username</label>
        <input
          type="text"
          name="username"
          value={perfil.username}
          onChange={handleChange}
        />

        <label>Nombre</label>
        <input
          type="text"
          name="nombre"
          value={perfil.nombre}
          onChange={handleChange}
        />

        <label>Cédula</label>
        <input
          type="text"
          name="cedula"
          value={perfil.cedula}
          onChange={handleChange}
        />

        <label>Apellidos</label>
        <input
          type="text"
          name="apellidos"
          value={perfil.apellidos}
          onChange={handleChange}
        />

        <label>Dirección</label>
        <input
          type="text"
          name="direccion"
          value={perfil.direccion}
          onChange={handleChange}
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={perfil.email}
          onChange={handleChange}
        />

        <div className="button-container">
          <button onClick={handleSaveChanges}>Guardar Cambios</button>
          <button onClick={onClose}>Cancelar</button>
          <button onClick={onOpenChangePassword}>Cambiar Contraseña</button>
        </div>
      </div>
    </div>
  );
}

export default Perfil;
