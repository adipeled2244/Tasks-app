import "./App.css";
import React from "react";
import Tasks from "./components/Tasks/Tasks";
import { useState, useEffect } from "react";
import { createApiClient } from "./Api/api";
import { useSpeechSynthesis } from "react-speech-kit";
import HearingIcon from "@mui/icons-material/Hearing";
import { Select } from "@mantine/core";

function App() {
  const api = createApiClient();
  const { speak } = useSpeechSynthesis();

  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [tasksString, setTasksString] = useState("");

  const [isAddMode, setIsAddMode] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);

  const [totalTasksNumber, setTotalTasksNumber] = useState(0);
  const [currentFilter, setCurrentFilter] = useState("All");

  const UrgencyDropdownOptions = [
    { label: "All", value: "All" },
    { label: "High", value: "High" },
    { label: "Mid", value: "Mid" },
    { label: "Low", value: "Low" },
  ]

  const tasksExists= filteredTasks.length > 0;

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const data = await api.getTasks("");
    setTasks(data.tasks);

    // create tasks string for speaking
    const tasksNames = data.tasks.map(
      (ticket) => `Task ${ticket.name} ${ticket.description} `
    );
    const tasksNamesString = tasksNames.join(" "); // join all the tasks names to one string

    setTasksString(tasksNamesString);
    setTotalTasksNumber(data.tasks.length);
    setFilteredTasks(data.tasks);
  };

  // add edit delete are on tasks state. if change tasks update filters and tasks string
  useEffect(() => {
    // update filtered tasks
    setFilteredTasks(tasks.filter((task) => task.urgency == currentFilter));

    // change filter to curr filter
    filterByUrgency(currentFilter);

    // update string for speaking
    const tasksNames = filteredTasks.map(
      (ticket) => `Task ${ticket.name} ${ticket.description}    `
    );
    const tasksNamesString = tasksNames.join(" ");
    setTasksString(tasksNamesString);
  }, [tasks, currentFilter, isSearchMode]);

  const handlePressPlus = () => {
    setIsAddMode(!isAddMode);
  };

  const handleAddTask = async (newTask) => {
    const task = { task: newTask };
    const data = await api.addTask(task);
    setTasks([...tasks, data.task]);
    setTotalTasksNumber((prev) => prev + 1);
  };

  const handleDeleteTask = async (id) => {
    console.log("delete");
    const data = await api.deleteTask(id);
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    setTotalTasksNumber((prev) => prev - 1);
  };

  const handleEditTask = async (id, editTask) => {
    const task = { task: editTask };

    const data = await api.updateTask(id, task);

    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, ...editTask };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  let timerId;
  const onSearch = async (searchText) => {
    clearTimeout(timerId); // cancael the previous timer
    timerId = setTimeout(async () => {
      const data = await api.getTasks(searchText);
      setTasks(data.tasks);
      setIsSearchMode(!(data.tasks.length == totalTasksNumber));
    }, 600);
  };

  const filterByUrgency = async (urgency) => {
    setCurrentFilter(urgency);
    if (urgency === "All") {
      setFilteredTasks(tasks);
      return;
    }
    setFilteredTasks(tasks.filter((task) => task.urgency === urgency));
  };

  return (
    <div className="home">
      <h1>My Tasks</h1>
      <header>
        <button className="add-btn" onClick={handlePressPlus}>
          <span>{isAddMode ? "-" : "+"}</span>
        </button>
        <button
          className="sound-btn"
          onClick={() => speak({ text: tasksString })}
        >
          <HearingIcon />
        </button>
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
          data={UrgencyDropdownOptions}
        />
      </header>
      {tasksExists && (
        <Tasks
          tasks={filteredTasks}
          filter={currentFilter}
          addMode={isAddMode}
          searchMode={isSearchMode}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onAdd={handleAddTask}
          setAddMode={setIsAddMode}
          setTasks={setTasks}
        />
      )}

      {!tasksExists && (
        <div className="no-tasks">No tasks to show</div>
      )}
    </div>
  );
}

export default App;
