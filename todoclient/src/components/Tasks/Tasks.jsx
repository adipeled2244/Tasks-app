import React, { useState } from "react";
import TaskCmp from "../TaskCmp/TaskCmp";
import "./Tasks.scss";

const Tasks = ({
  tasks: renderTasks,
  onDeleteTask,
  onAdd,
  onEditTask,
  addMode,
  setAddMode,
}) => {
  const handleAddTask = async (task) => {
    setAddMode(false);
    onAdd(task);
  };

  return (
    <div className="tasks">
      <div className="tasks-list">
        {renderTasks.length > 0 &&
          renderTasks.map((task, index) => {
            return (
              <TaskCmp
                task={task}
                key={task.id}
                onDeleteTask={onDeleteTask}
                onEditTask={onEditTask}
                addMode={addMode}
              />
            );
          })}

        {addMode && (
          <TaskCmp key={-1} onAdd={handleAddTask} addMode={addMode} />
        )}
      </div>
    </div>
  );
};

export default Tasks;
