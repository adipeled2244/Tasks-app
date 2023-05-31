import React from "react";
import "./TaskCmp.scss";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { Checkbox } from "@mantine/core";
import { useForm } from "@mantine/form";
import { TextInput, Select, Button } from "@mantine/core";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
const TaskCmp = ({ task: renderTask, onDeleteTask, onAdd ,onEditTask,addMode}) => {
  const [completed, setCompleted] = useState(
    renderTask ? renderTask.completed : 0
  );
  const [editMode, setEditMode] = useState(false);

  const handleComplete = () => {
    console.log("handleComplete");
    onEditTask(renderTask.id, { completed: !completed });
    setCompleted((prev) => !prev);
  };

  const handleEditPress = () => {
    console.log("handleEdit");
    setEditMode(true);
  };

  ////////// to add task
  const handleSubmit = async () => {
    onAdd(form.values);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    form.reset();  /// remove changes from the form if user press edit change and cancel 
    };

    const handleSaveEdit = () => {
        setEditMode(false);
        onEditTask(renderTask.id, form.values);
    };

  const form = useForm({
    initialValues: {
      name: renderTask ? renderTask.name : "",
      description: renderTask ? renderTask.description : "",
      field: renderTask ? renderTask.field : "",
      urgency: renderTask ? renderTask.urgency : "",
      completed: renderTask ? renderTask.completed : false,
    },
  });

  const isNewTask=addMode && !renderTask?.id;


 
    return (
      <form className="task"  onSubmit={form.onSubmit(handleSubmit)}>
        <div className="task-name task-field ">
          {!(isNewTask||editMode) && <p className="content">{renderTask.name}</p>}
          {(isNewTask||editMode) && (
            <TextInput
              required
              placeholder="Name"
              {...form.getInputProps("name")}
              onChange={(event) =>
                form.setFieldValue(`name`, event.currentTarget.value)
              }
            />
          )}
        </div>
        <div className="task-description task-field">
          {!(isNewTask||editMode) && <p className="content">{renderTask.description}</p>}
          {(isNewTask||editMode) && (
            <TextInput
              required
              placeholder="Description"
              {...form.getInputProps("description")}
              onChange={(event) =>
                form.setFieldValue(`description`, event.currentTarget.value)
              }
            />
          )}
        </div>
        <div className="task-field task-field">
          {!(isNewTask||editMode) && <p className="content">{renderTask.field}</p>}
          {(isNewTask||editMode) && (
            <TextInput
              required
              placeholder="Field"
              {...form.getInputProps("field")}
              onChange={(event) =>
                form.setFieldValue(`field`, event.currentTarget.value)
              }
            />
          )}
        </div>
        <div className="task-urgency task-field">
          {!(isNewTask||editMode) && <p className="content">{renderTask.urgency}</p>}
          {(isNewTask||editMode) && (
            <Select
              placeholder="Urgency"
              size="sm"
              required
              w="100%"
              value={form.getInputProps("urgency").value}
              onChange={(value) => form.setFieldValue("urgency", value)}
              data={[
                { label: "High", value: "High" },
                { label: "Mid", value: "Mid" },
                { label: "Low", value: "Low" },
              ]}
            />
          )}
        </div>

        <div className="task-complete">
         { !(isNewTask||editMode)&& <Checkbox
            color="teal"
            radius="lg"
            size="lg"
            checked={completed}
            onChange={(event) => handleComplete(event.currentTarget.checked)}
          />}
        </div>
        <div className="actions">
             {!(isNewTask||editMode) &&<button onClick={handleEditPress}><ModeEditIcon /></button>}
          
            {editMode && (
              <div className="edit-cancel-btns">
                 <button style={{width:"10px", height:"10px"}} onClick={handleSaveEdit}> <CheckIcon style={{fontSize:"20px"}} /></button>
                 <button style={{width:"10px", height:"10px"}}  onClick={handleCancelEdit}> <ClearIcon style={{fontSize:"20px"}}  /></button>
              </div>
            )}
          
          {!(isNewTask||editMode) && <button onClick={() => onDeleteTask(renderTask.id)}>
            <DeleteIcon />{" "}
          </button>}
        </div>

       { isNewTask && <Button type="submit" color="grape" radius="xl">
          Add task
        </Button>}

      </form>
    );
    //add form
  
};

export default TaskCmp;
