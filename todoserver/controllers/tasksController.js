const tasks = require("../Data/tasks.json");
console.log(tasks);
const { getMap } = require("../utils/map");
const { sortByKey } = require("../utils/utils");

exports.tasksController = {
  async getTasks(req, res) {
    const searchText = req.query?.searchText;
    if (searchText != "" && searchText != undefined) { // search text is not empty 
      if (searchText.startsWith("supersearch:")) { //1- super search
        const searchWord = String(searchText).trim().split(":")[1]; // get word after supersearch:
        const searchMap = new Map(getMap(tasks, false)); // get/create map
        const indexs = searchMap.get(searchWord.toLowerCase());
        if (indexs === undefined) { 
          return res.status(200).json({ tasks: [] });
        }
        const searchedTasks = indexs?.map((index) => tasks[index]);
        return res.status(200).json({ tasks: searchedTasks });
      } else { //2- pure search 
        const searchedTasks = tasks.filter((task) =>
          task.name.toLowerCase().includes(searchText.toLowerCase())
        );
        return res.status(200).json({ tasks: searchedTasks });
      }
    }
    sortByKey(tasks, "listPlace"); // sort tasks by listPlace
    res.status(200).json({ tasks }); // return object with tasks array : {"tasks": [task1, task2, ...]}
  },

  async getTask(req, res) {
    console.log("getTask");
    res.status(200).json({ message: "getTask" });
  },

  async addTask(req, res) {
    console.log("addTask");
    const task = req.body.task;
    task.id = tasks.length + 1;
    task.listPlace = tasks.length + 1; // place start from 1
    tasks.push(task);
    getMap(tasks, true); // create map again
    res.status(200).json({ task });
  },

  //? add task in postman
  //?   {
  //?    "task":{
  //?        "name": "Sleep",
  //?        "description": "This is task 5",
  //?        "completed": false,
  //?        "field": "home",
  //?        "urgency": "High",
  //?         "listPlace": 5
  //?       }
  //?  }

  async updateTask(req, res) {
    console.log(`updateTask ${req.params.id}`);
    const id = req.params.id;
    const updates = req.body.task;
    if (updates.name) {
      getMap(tasks, true);
    }
    const index = tasks.findIndex((task) => task.id == id);
    tasks[index] = { ...tasks[index], ...updates };

    res.status(200).json({ message: "updateTask" });
  },
  //? updateTask in postman
  //? {
  //?   "task":{
  //?         "name": "Buy potatos"
  //?    }
  //? }

  async deleteTask(req, res) {
    console.log(`deleteTask ${req.params.id}`);
    const id = req.params.id;
    const index = tasks.findIndex((task) => task.id == id);
    tasks.splice(index, 1); // delete 1 element from index
    getMap(tasks, true);
    res.status(200).json({ message: "deleteTask" });
  },
};
