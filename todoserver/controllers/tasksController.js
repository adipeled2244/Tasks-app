const tasks = require("../Data/tasks.json");
console.log(tasks);
const { getMap } = require("../utils/map");
const  {sortByKey} = require ("../utils/utils");

exports.tasksController = {
  async getTasks(req, res) {
    const searchText = req.query?.searchText;
    if (searchText) {
      //supersearch:buy
      if (searchText.startsWith("supersearch:")) {
        const searchWord = String(searchText).trim().split(":")[1];
        const searchMap = new Map(getMap(tasks, false));
        const indexs = searchMap.get(searchWord.toLowerCase());
        if (indexs === undefined) {
          return res.status(200).json({ tasks: [] });
        }
        const resultTasks = indexs?.map((index) => tasks[index]);
        return res.status(200).json({ tasks: resultTasks });
      } else {
        const filteredTasks = tasks.filter((task) =>
          task.name.toLowerCase().includes(searchText.toLowerCase())
        );
        return res.status(200).json({ tasks: filteredTasks });
      }
    }
    sortByKey(tasks, "listPlace")
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
    task.listPlace = tasks.length + 1;
    tasks.push(task);
    getMap(tasks, true);
    res.status(200).json({ task });
  },
  // in postman
  //   {
  //     "task":{
  //           "name": "Sleep",
  //       "description": "This is task 5",
  //       "completed": false,
  //       "field": "home",
  //       "urgency": "High"
  //      }
  // }

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
  // in postman
  // {
  //   "task":{
  //         "name": "Buy potatos"
  //    }
  // }

  async deleteTask(req, res) {
    console.log(`deleteTask ${req.params.id}`);
    const id = req.params.id;
    const index = tasks.findIndex((task) => task.id == id);
    tasks.splice(index, 1);
    getMap(tasks, true);
    res.status(200).json({ message: "deleteTask" });
  },
};
