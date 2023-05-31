import React,{useState} from "react";
import TaskCmp from '../TaskCmp/TaskCmp';
import "./Tasks.scss";

const Tasks = ({ tasks :renderTasks, onDeleteTask, onAdd, onEditTask }) => {
const [addMode, setAddMode] = useState(false);
const handlePressPlus=()=>{
  setAddMode(!addMode);
}

const handleAddTask = async (task) => {
  setAddMode(false)
  onAdd(task);
}

  return (
    <div className="tasks">
    <button className="add-btn" onClick={handlePressPlus}  >{addMode? '-':'+'}</button>
    <div className="tasks-list">
      {renderTasks.length!==0 && renderTasks.map((task,index) => {
         return <TaskCmp task={task} key={task.id} onDeleteTask={onDeleteTask} onEditTask={onEditTask} addMode={addMode}  />;
      })}
      {/* {renderTasks && renderTasks.length===0 && <div className="no-tasks">No tasks to show</div>} */}
      {addMode && <TaskCmp  key={-1} onAdd={handleAddTask} addMode={addMode}   />}
    </div></div>
  );
};

export default Tasks;
