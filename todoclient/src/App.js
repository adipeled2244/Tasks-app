import "./App.css";
import React from "react";
import Tasks from "./components/Tasks/Tasks";
import { useState, useEffect } from "react";
import { createApiClient } from "./Api/api";
import { useSpeechSynthesis } from 'react-speech-kit';
import HearingIcon from '@mui/icons-material/Hearing';
function App() {
  const api = createApiClient();
  const [tasks, setTasks] = useState([]);
  const { speak } = useSpeechSynthesis()
  const [tasksNamesStr, setTasksNamesStr] = useState([]);
  const [addMode, setAddMode] = useState(false);
  const handlePressPlus = () => {
    setAddMode(!addMode);
  };

  useEffect(() => {
    const fetchTasks = async () => {
      const data = await api.getTasks('');
      setTasks(data.tasks);
      const tasksNames = data.tasks.map((ticket,index) => `Task ${index+1} ${ticket.name}`);

      const tasksNamesString = tasksNames.join(' ');

      setTasksNamesStr(tasksNamesString);
    };
    fetchTasks();
  }, []);

  useEffect(() => {
    console.log(tasks)
    const tasksNames = tasks.map((ticket,index) => `Task ${index+1} ${ticket.name}`);
    const tasksNamesString = tasksNames.join(' ');

    setTasksNamesStr(tasksNamesString);
  }, [tasks]);

  const handleAddTask = async (newTask) => {
    
    const task={"task":newTask}
    const data = await api.addTask(task);
    setTasks([...tasks, data.task]);
  };

  const handleDeleteTask = async (id) => {
    const data = await api.deleteTask(id);
    const updatedTasks=tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
  };

  const handleEditTask = async (id, editTask) => {
    const task={"task":editTask}

    const data = await api.updateTask(id, task);
    const updatedTasks=tasks.map((task) => {
      if (task.id === id) {
        return { ...task, ...editTask };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  let timerId;
  const onSearch = async (searchText) => {
    clearTimeout(timerId) // cancael the previous timer
    const data = await api.getTasks();
    timerId= setTimeout(async() => {
      const data= await api.getTasks(searchText);
      setTasks(data.tasks);

    },300)

  }


  return (
    <div className="home">
      
        <h1>My Tasks</h1>
        <header>
        <button className="add-btn" onClick={handlePressPlus}>
        {addMode ? "-" : "+"}
      </button>
        <button className="sound-btn"  onClick={() => speak({ text: tasksNamesStr })}><HearingIcon/></button>
        <input
          type="search"
          placeholder="Search..."
          onChange={(e) => onSearch(e.target.value)}
        />
        </header>
        {tasks.length >0  && <Tasks
          tasks={tasks}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onAdd={handleAddTask}
          addMode={addMode}
          setAddMode={setAddMode}
        />}

        {tasks.length === 0 && <div className="no-tasks">No tasks to show</div>}
       
    </div>
  );
}

export default App;
