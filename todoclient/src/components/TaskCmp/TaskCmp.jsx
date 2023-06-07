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

const TaskCmp = ({
  task: renderTask,
  onDeleteTask,
  onAdd,
  onEditTask,
  addMode,
}) => {
  const [completed, setCompleted] = useState(
    renderTask ? renderTask.completed : 0
  );
  const [editMode, setEditMode] = useState(false);

  const form = useForm({
    initialValues: {
      name: renderTask ? renderTask.name : "",
      description: renderTask ? renderTask.description : "",
      field: renderTask ? renderTask.field : "",
      urgency: renderTask ? renderTask.urgency : "",
      completed: renderTask ? renderTask.completed : false,
    },
  });

  const UrgencyDropdownEditOptions = [
    { label: "High", value: "High" },
    { label: "Mid", value: "Mid" },
    { label: "Low", value: "Low" },
  ]

  const handleComplete = () => {
    console.log("handleComplete");
    onEditTask(renderTask.id, { completed: !completed }); // update completed in backend
    setCompleted((prev) => !prev);
  };

  const handleEditPress = () => {
    console.log("handleEditPress");
    setEditMode(true);
  };

  const handleSubmit = (e) => {
    console.log("handleSubmit");
    e.preventDefault();
    onAdd(form.values);
  };

  const handleCancelEdit = (e) => {
    console.log("handleCancelEdit");
    e.preventDefault();
    setEditMode(false);
    form.reset(); /// remove changes from the form if user press edit change and cancel
  };

  const handleDeletePress = (e) => {
    console.log("handleDelete");
    e.preventDefault();
    onDeleteTask(renderTask.id);
  };

  const handleSaveEdit = (e) => {
    console.log("handleSaveEdit");
    e.preventDefault();
    setEditMode(false);
    onEditTask(renderTask.id, form.values);
  };

  const isNewTask = addMode && !renderTask?.id;
  const showInputsOpen = isNewTask || editMode;


  return (
    <form className="task">
      <div className="task-name task-field ">
        {!showInputsOpen && <p className="content">{renderTask.name}</p>}
        {showInputsOpen && (
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
        {!showInputsOpen && <p className="content">{renderTask.description}</p>}
        {showInputsOpen && (
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
        {!showInputsOpen && <p className="content">{renderTask.field}</p>}
        {showInputsOpen && (
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
        {!showInputsOpen && <p className="content">{renderTask.urgency}</p>}
        {showInputsOpen && (
          <Select
            placeholder="Urgency"
            size="sm"
            required
            w="100%"
            value={form.getInputProps("urgency").value}
            onChange={(value) => form.setFieldValue("urgency", value)}
            data={UrgencyDropdownEditOptions}
          />
        )}
      </div>

      <div className="task-complete">
        {!showInputsOpen && (
          <Checkbox
            color="teal"
            radius="lg"
            size="lg"
            checked={completed}
            onChange={(event) => handleComplete(event.currentTarget.checked)}
          />
        )}
      </div>

      <div className="actions">
        {!showInputsOpen && (
          <button className="action-btn" onClick={handleEditPress}>
            <ModeEditIcon />
          </button>
        )}

        {editMode && (
          <div className="edit-cancel-btns">
            <button
              className="action-btn save-edit-btn"
              onClick={handleSaveEdit}
            >
              <CheckIcon style={{ fontSize: "20px" }} />
            </button>

            <button
              className="action-btn  cancel-edit-btn "
              onClick={handleCancelEdit}
            >
              <ClearIcon style={{ fontSize: "20px" }} />
            </button>
          </div>
        )}

        {!showInputsOpen && (
          <button className="action-btn" onClick={handleDeletePress}>
            <DeleteIcon />
          </button>
        )}

        {isNewTask && (
          <Button color="grape" radius="xl" onClick={handleSubmit}>
            Add task
          </Button>
        )}
      </div>
    </form>
  );
};

export default TaskCmp;
