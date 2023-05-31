const {Router} = require('express');
const tasksRouter = Router();
const {tasksController} = require("../controllers/tasksController");

tasksRouter.get("/",tasksController.getTasks )
tasksRouter.get("/:id",tasksController.getTask )
tasksRouter.post("/",tasksController.addTask )
tasksRouter.patch("/:id",tasksController.updateTask  )
tasksRouter.delete("/:id",tasksController.deleteTask )

module.exports = tasksRouter;