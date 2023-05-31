const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
const tasksRouter = require("./routers/tasksRouter");

app.use(express.json());
app.use((_, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    next();
  });

  app.use("/api/tasks",tasksRouter);
  app.use((req, res) => {
    res.status(404).send(`Page not found`);
  });
app.listen(port, () => console.log(`Express server is running on port ${port}`));