import React from 'react';
import './Modal.css';

function ModalTarea({ tareaEditada, setTareaEditada, listas, guardarEdicionTarea, nuevaEtiqueta, setNuevaEtiqueta, etiquetas }) {
  if (!tareaEditada) return null;

  const handleClose = () => {
    setTareaEditada(null);
  };

  return (
    <div className="modal-backdrop-tarea">
      <div className="modal-tarea">
        <button className="close" onClick={handleClose}>×</button>
        <h3>Información de la Tarea</h3>
        
        <label>Título de la tarea</label>
        <input
          type="text"
          value={tareaEditada.titulo}
          onChange={(e) => setTareaEditada({ ...tareaEditada, titulo: e.target.value })}
          placeholder="Título de la tarea"
        />
        
        <label>Descripción de la tarea</label>
        <textarea
          value={tareaEditada.descripcion || ''}
          onChange={(e) => setTareaEditada({ ...tareaEditada, descripcion: e.target.value })}
          placeholder="Descripción de la tarea"
        />
        
        <label>Prioridad</label>
        <select
          value={tareaEditada.prioridad}
          onChange={(e) => setTareaEditada({ ...tareaEditada, prioridad: e.target.value })}
        > 
          <option value="alta">Alta</option>
          <option value="media">Media</option>
          <option value="baja">Baja</option>
        </select>
        
        <label>Estado (Lista)</label>
        <select
          value={tareaEditada.lista}
          onChange={(e) => setTareaEditada({ ...tareaEditada, lista: parseInt(e.target.value) })}
        >
          {listas.map((lista) => (
            <option key={lista.id} value={lista.id}>{lista.nombre}</option>
          ))}
        </select>
        
        <label>Fecha de creación</label>
        <input
          type="date"
          value={tareaEditada.fecha_creacion ? tareaEditada.fecha_creacion.split('T')[0] : ''}
          onChange={(e) => setTareaEditada({ ...tareaEditada, fecha_creacion: e.target.value })}
          placeholder="Fecha de creación"
        />
        
        <label>Fecha de vencimiento</label>
        <input
          type="date"
          value={tareaEditada.fecha_vencimiento ? tareaEditada.fecha_vencimiento.split('T')[0] : ''}
          onChange={(e) => setTareaEditada({ ...tareaEditada, fecha_vencimiento: e.target.value })}
          placeholder="Fecha de vencimiento"
        />
        
        <label>Etiqueta</label>
        <select
          value={tareaEditada.etiquetas}
          onChange={(e) => {
            const selectedValue = e.target.value;
            if (selectedValue === 'otra') {
              setNuevaEtiqueta(''); // Reiniciar nueva etiqueta
            }
            setTareaEditada({ ...tareaEditada, etiquetas: selectedValue });
          }}
        >
          <option value="">Seleccionar etiqueta existente o escribir nueva</option>
          {etiquetas.map((etiqueta, index) => (
            <option key={index} value={etiqueta}>
              {etiqueta}
            </option>
          ))}
          <option value="otra">Otra (escribe nueva etiqueta)</option>
        </select>
        
        {tareaEditada.etiquetas === 'otra' && (
          <input
            type="text"
            value={nuevaEtiqueta}
            placeholder="Nueva etiqueta"
            onChange={(e) => setNuevaEtiqueta(e.target.value)}
          />
        )}
        
        <div className="button-container">
          <button onClick={guardarEdicionTarea}>Guardar Cambios</button>
          <button onClick={handleClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

export default ModalTarea;

