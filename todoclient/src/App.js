import "./App.css";
import React, { useRef } from "react";
import Tasks from "./components/Tasks/Tasks";
import { useState, useEffect } from "react";
import { createApiClient } from "./Api/api";
import { useSpeechSynthesis } from 'react-speech-kit';
import HearingIcon from '@mui/icons-material/Hearing';
import { Select } from "@mantine/core";

function App() {
  const api = createApiClient();
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const { speak } = useSpeechSynthesis()
  const [tasksNamesStr, setTasksNamesStr] = useState([]);

  const [addMode, setAddMode] = useState(false);
  const [searchMode, setSearcMode] = useState(false);

  const [totalTasksNumber, setTotalTasksNumber] = useState(0);
  const [filter, setFilterValue] = useState('All');

  useEffect(() => {
    const fetchTasks = async () => {
      const data = await api.getTasks('');
      setTasks(data.tasks);
      const tasksNames = data.tasks.map((ticket,index) => `Task ${index+1} ${ticket.name}`);
      const tasksNamesString = tasksNames.join(' ');

      setTasksNamesStr(tasksNamesString);
      setTotalTasksNumber(data.tasks.length);
      setFilteredTasks(data.tasks);
    };
    fetchTasks();
    
  }, []);


  const handlePressPlus = () => {
    setAddMode(!addMode);
  };

  //ההוספה מחיקה ועריכה הם על טאסקס
  // אם משנים טאסקס מעדכנים מפולטרים
  // אם משנים טאסקס מעדכנים מחרוזת הקראה
  
  useEffect(() => {
    setFilteredTasks(tasks.filter(task=> task.urgency==filter));  
    filterByUrgency(filter); // מאתחלים את הפילטר עם הפילטר הנבחר

    const tasksNames = filteredTasks.map((ticket,index) => `Task ${index+1} ${ticket.name}`);
    const tasksNamesString = tasksNames.join(' ');

    setTasksNamesStr(tasksNamesString);


  }, [tasks,filter,searchMode]);

  const handleAddTask = async (newTask) => {
    
    const task={"task":newTask}
    const data = await api.addTask(task);
    setTasks([...tasks, data.task]);
    setTotalTasksNumber((prev) => prev + 1);

  };

  const handleDeleteTask = async (id) => {
   console.log("delete")
    const data = await api.deleteTask(id);
    const updatedTasks=tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    setTotalTasksNumber((prev) => prev - 1);

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
      setSearcMode(!(data.tasks.length == totalTasksNumber))
    },600)

  }

  const filterByUrgency = async (urgency) => {
    setFilterValue(urgency);
    if(urgency === "All"){
      setFilteredTasks(tasks);
      return;
    }

    setFilteredTasks(tasks.filter((task) => task.urgency === urgency));

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
           <Select
            placeholder="Urgency"
            size="sm"
            required
            w="15%"
            onChange={(value) => filterByUrgency(value)}
            data={[
              { label: "All", value: "All" },
              { label: "High", value: "High" },
              { label: "Mid", value: "Mid" },
              { label: "Low", value: "Low" },
            ]}
          />
        </header>
        {tasks.length >0  && <Tasks
        filter={filter}
        searchMode={searchMode}
          tasks={filteredTasks}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onAdd={handleAddTask}
          addMode={addMode}
          setAddMode={setAddMode}
          setTasks={setTasks}
        />}

        {filteredTasks.length === 0 && <div className="no-tasks">No tasks to show</div>}
       
    </div>
  );
}

export default App;
