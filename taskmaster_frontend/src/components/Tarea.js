import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

const Tarea = ({ tarea, index }) => (
  <Draggable key={tarea.id} draggableId={String(tarea.id)} index={index}>
    {(provided) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className="tarea"
      >
        <p>{tarea.titulo}</p>
      </div>
    )}
  </Draggable>
);

export default Tarea;
