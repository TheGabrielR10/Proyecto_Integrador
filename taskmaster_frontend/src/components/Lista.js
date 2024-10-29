import React from 'react';
import Tarea from './Tarea';
import { Droppable } from 'react-beautiful-dnd';

const Lista = ({ lista, tareas }) => (
  <Droppable key={lista.id} droppableId={String(lista.id)}>
    {(provided) => (
      <div ref={provided.innerRef} {...provided.droppableProps} className="lista">
        <h2>{lista.nombre}</h2>
        {tareas
          .filter((tarea) => tarea.lista === lista.id)
          .map((tarea, index) => (
            <Tarea key={tarea.id} tarea={tarea} index={index} />
          ))}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
);

export default Lista;
