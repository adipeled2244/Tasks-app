import "./App.css";
import React, { useRef } from "react";
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
  const [searchMode, setSearcMode] = useState(false);
  const [totalTasks, setTotalTasks] = useState(0);

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
      setTotalTasks(data.tasks.length);
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
    setTotalTasks((prev) => prev + 1);

  };

  const handleDeleteTask = async (id) => {
    const data = await api.deleteTask(id);
    const updatedTasks=tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    setTotalTasks((prev) => prev - 1);

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
    console.log(updatedTasks)
    setTasks(updatedTasks);
  };

  let timerId;
  const onSearch = async (searchText) => {
    clearTimeout(timerId) // cancael the previous timer
    timerId= setTimeout(async() => {
      const data= await api.getTasks(searchText);
      setTasks(data.tasks);
      console.log(data.tasks.length)
      console.log(totalTasks)
      setSearcMode(!(data.tasks.length == totalTasks))
      console.log(searchMode)
      // if(data.tasks.length == totalTasks){
      //   setSearcMode(false);

      // }else{
      //   setSearcMode(true);    

      // }
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
        searchMode={searchMode}
          tasks={tasks}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onAdd={handleAddTask}
          addMode={addMode}
          setAddMode={setAddMode}
          setTasks={setTasks}
        />}

        {tasks.length === 0 && <div className="no-tasks">No tasks to show</div>}
       
    </div>
  );
}

export default App;
