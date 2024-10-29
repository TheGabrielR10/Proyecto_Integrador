import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import api from '../axiosConfig';
import './KanbanBoard.css';
import ModalTarea from './ModalTarea';
import Perfil from './Perfil';
import CambiarContrasena from './CambiarContrasena';

function KanbanBoard() {
  const [listas, setListas] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [nuevaLista, setNuevaLista] = useState('');
  const [nuevaTarea, setNuevaTarea] = useState({ titulo: '', lista: null, prioridad: 'media', estado: 'pendiente', posicion: 1, etiquetas: '' });
  const [tareaEditada, setTareaEditada] = useState(null);
  const [etiquetas, setEtiquetas] = useState([]);
  const [nuevaEtiqueta, setNuevaEtiqueta] = useState('');
  const [filtroEtiqueta, setFiltroEtiqueta] = useState('');
  const [filtroPrioridad, setFiltroPrioridad] = useState('');
  const [filtroFechaVencimiento, setFiltroFechaVencimiento] = useState('');
  const [isPerfilOpen, setPerfilOpen] = useState(false); // Estado para el modal de Perfil
  const [isCambiarContrasenaOpen, setCambiarContrasenaOpen] = useState(false); // Estado para el modal de Cambiar Contraseña
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/listas/').then((response) => setListas(response.data));
    api.get('/tareas/').then((response) => {
      setTareas(response.data);
      const etiquetasUnicas = [...new Set(response.data.map((tarea) => tarea.etiquetas).filter((etiqueta) => etiqueta))];
      setEtiquetas(etiquetasUnicas);
    });
  }, []);

  const agregarLista = () => {
    if (nuevaLista.trim() === '') return;
    api.post('/listas/', { nombre: nuevaLista })
      .then((response) => {
        setListas([...listas, response.data]);
        setNuevaLista('');
      })
      .catch((error) => {
        console.error('Error al agregar la lista:', error);
      });
  };

  const eliminarLista = (id) => {
    const tareasEnLista = tareas.filter((tarea) => tarea.lista === id);
    if (tareasEnLista.length > 0) {
      alert('No puedes eliminar esta lista porque contiene tareas activas.');
      return;
    }
    if (window.confirm('¿Estás seguro de eliminar esta lista de tareas?')) {
      api.delete(`/listas/${id}/`)
        .then(() => {
          setListas(listas.filter((lista) => lista.id !== id));
        })
        .catch((error) => {
          console.error('Error al eliminar la lista:', error);
        });
    }
  };

  const agregarTarea = (listaId) => {
    if (nuevaTarea.titulo.trim() === '') return;
    const tareaParaAgregar = { ...nuevaTarea, lista: listaId };
    api.post('/tareas/', tareaParaAgregar)
      .then((response) => {
        setTareas([...tareas, response.data]);
        setNuevaTarea({ titulo: '', lista: null, prioridad: 'media', estado: 'pendiente', posicion: 1, etiquetas: '' });
      })
      .catch((error) => {
        console.error('Error al agregar la tarea:', error);
      });
  };

  const eliminarTarea = (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta tarea?')) {
      api.delete(`/tareas/${id}/`)
        .then(() => {
          setTareas(tareas.filter((tarea) => tarea.id !== id));
        })
        .catch((error) => {
          console.error('Error al eliminar la tarea:', error);
        });
    }
  };

  const editarTarea = (tarea) => {
    setTareaEditada(tarea);
  };

  const guardarEdicionTarea = () => {
    if (!tareaEditada) return;
    if (tareaEditada.etiquetas === 'otra' && nuevaEtiqueta.trim() !== '') {
      tareaEditada.etiquetas = nuevaEtiqueta;
    }

    api.put(`/tareas/${tareaEditada.id}/`, tareaEditada)
      .then((response) => {
        setTareas(tareas.map((tarea) => (tarea.id === tareaEditada.id ? response.data : tarea)));
        setTareaEditada(null);
        setNuevaEtiqueta('');
      })
      .catch((error) => {
        console.error('Error al editar la tarea:', error);
      });
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    const updatedTareas = [...tareas];
    const [movedTarea] = updatedTareas.splice(source.index, 1);
    movedTarea.lista = parseInt(destination.droppableId, 10);
    updatedTareas.splice(destination.index, 0, movedTarea);
    setTareas(updatedTareas);

    api.put(`/tareas/${movedTarea.id}/`, movedTarea)
      .then((response) => {
        console.log('Tarea actualizada', response.data);
      })
      .catch((error) => {
        console.error('Error al actualizar la tarea:', error);
      });
  };

  const filtrarTareas = (tareas) => {
    let tareasFiltradas = tareas;
    if (filtroEtiqueta !== '') {
      tareasFiltradas = tareasFiltradas.filter((tarea) => tarea.etiquetas === filtroEtiqueta);
    }
    if (filtroPrioridad !== '') {
      tareasFiltradas = tareasFiltradas.filter((tarea) => tarea.prioridad === filtroPrioridad);
    }
    if (filtroFechaVencimiento !== '') {
      tareasFiltradas = tareasFiltradas.filter((tarea) => tarea.fecha_vencimiento && tarea.fecha_vencimiento.split('T')[0] === filtroFechaVencimiento);
    }
    return tareasFiltradas;
  };

  const resetearFiltros = () => {
    setFiltroEtiqueta('');
    setFiltroPrioridad('');
    setFiltroFechaVencimiento('');
  };

  const cerrarSesion = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/');
  };

  return (
    <div className="main-container">
      <div className="kanban-board">
        <div className="filtros-y-nueva-lista">
          <div className="nueva-lista">
            <input
              type="text"
              value={nuevaLista}
              onChange={(e) => setNuevaLista(e.target.value)}
              placeholder="Nueva lista"
            />
            <button onClick={agregarLista}>Agregar Lista</button>
          </div>
          <div className="filtros">
            <div className="filtro-etiqueta">
              <label>Filtrar por etiqueta:</label>
              <select value={filtroEtiqueta} onChange={(e) => setFiltroEtiqueta(e.target.value)}>
                <option value="">Todas</option>
                {etiquetas.map((etiqueta, index) => (
                  <option key={index} value={etiqueta}>{etiqueta}</option>
                ))}
              </select>
            </div>
            <div className="filtro-prioridad">
              <label>Filtrar por prioridad:</label>
              <select value={filtroPrioridad} onChange={(e) => setFiltroPrioridad(e.target.value)}>
                <option value="">Todas</option>
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
            </div>
            <button onClick={resetearFiltros}>Quitar Filtros</button>
            <button onClick={cerrarSesion}>Cerrar Sesión</button>
          </div>
          <div className="perfil-opciones">
            <button onClick={() => setPerfilOpen(true)} className="btn btn-primary">
              Perfil
            </button>
            <button onClick={() => setCambiarContrasenaOpen(true)} className="btn btn-secondary">
              Cambiar Contraseña
            </button>
          </div>
        </div>
      </div>
      
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="lista-contenedor">
          {listas.map((lista) => (
            <Droppable key={lista.id} droppableId={String(lista.id)}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="lista">
                  <div className="lista-header">
                    <h2>{lista.nombre}</h2>
                    <button onClick={() => eliminarLista(lista.id)}>Eliminar Lista</button>
                  </div>
                  {filtrarTareas(tareas)
                    .filter((tarea) => tarea.lista === lista.id)
                    .map((tarea, index) => (
                      <Draggable key={tarea.id} draggableId={String(tarea.id)} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="tarea"
                            onClick={() => editarTarea(tarea)}
                          >
                            <p>{tarea.titulo}</p>
                            <p className="tarea-descripcion">
                              {tarea.descripcion ? tarea.descripcion.substring(0, 100) : ''}
                            </p>
                            <button onClick={(e) => { e.stopPropagation(); eliminarTarea(tarea.id); }}>Eliminar Tarea</button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                  <div className="nueva-tarea">
                    <input
                      type="text"
                      value={nuevaTarea.lista === lista.id ? nuevaTarea.titulo : ''}
                      onChange={(e) => setNuevaTarea({ ...nuevaTarea, titulo: e.target.value, lista: lista.id })}
                      placeholder="Nueva tarea"
                    />
                    <button onClick={() => agregarTarea(lista.id)}>Agregar Tarea</button>
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {/* Modales */}
      {isPerfilOpen && (
        <Perfil onClose={() => setPerfilOpen(false)} onOpenChangePassword={() => { setPerfilOpen(false); setCambiarContrasenaOpen(true); }} />
      )}
      {isCambiarContrasenaOpen && (
        <CambiarContrasena onClose={() => setCambiarContrasenaOpen(false)} />
      )}
      {tareaEditada && (
        <ModalTarea
          tareaEditada={tareaEditada}
          setTareaEditada={setTareaEditada}
          listas={listas}
          guardarEdicionTarea={guardarEdicionTarea}
          nuevaEtiqueta={nuevaEtiqueta}
          setNuevaEtiqueta={setNuevaEtiqueta}
          etiquetas={etiquetas}
        />
      )}
    </div>
  );
}

export default KanbanBoard;
