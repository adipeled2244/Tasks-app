import React, { useState } from "react";
import TaskCmp from "../TaskCmp/TaskCmp";
import "./Tasks.scss";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Tasks = ({
  tasks: renderTasks,
  onDeleteTask,
  onAdd,
  onEditTask,
  addMode,
  setAddMode,
  searchMode,
  setTasks
}) => {
  const handleAddTask = async (task) => {
    setAddMode(false);
    onAdd(task);
  };
  
  function handleOnDragEnd(result) {
    if (!result.destination) return;
    const items = renderTasks;
    const [reorderedItem] = items.splice(result.source.index, 1); /// from index , how many = remove 1
    items.splice(result.destination.index, 0, reorderedItem);
    items.map((task,index) => {task.listPlace=index+1
      onEditTask(task.id,{listPlace:index+1})
      return task;
    })
    console.log(items)
    setTasks(items);
  }

  return (
    <div className="tasks">
      <div className="tasks-list">
        <DragDropContext onDragEnd={handleOnDragEnd}  >
          <Droppable droppableId="droptasks" >
          {(provided) => (<div className="droptasks"  {...provided.droppableProps} ref={provided.innerRef}>
              {renderTasks.length > 0 &&
                renderTasks.map((task, index) => {
                  return (
                    <Draggable key={task.id} draggableId={String(task.id)} index={index} isDragDisabled={searchMode}>
                      {(provided) => (
                      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                      <TaskCmp
                      task={task}  
                      onDeleteTask={onDeleteTask}
                      onEditTask={onEditTask}
                      addMode={addMode}
                    /> </div>)}

                    </Draggable>
                  );
                })}
                 {provided.placeholder}
            </div>
            )}
          </Droppable>
        </DragDropContext>
        {addMode && (
          <TaskCmp key={-1} onAdd={handleAddTask} addMode={addMode} />
        )}
      </div>
    </div>
  );
};

export default Tasks;
