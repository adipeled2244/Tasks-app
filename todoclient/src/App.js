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
        <button className="sound-btn"  onClick={() => speak({ text: tasksNamesStr })}><HearingIcon/></button>

        <input
          type="search"
          placeholder="Search..."
          onChange={(e) => onSearch(e.target.value)}
        />
        </header>
        <Tasks
          tasks={tasks}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onAdd={handleAddTask}
        />
       
    </div>
  );
}

export default App;