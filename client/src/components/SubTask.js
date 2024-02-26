import React, { useState, useEffect } from "react";
import axios from "axios";
import Alerts from "./Alerts";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CustomDialog from "./CustomDialog";

const SubTask = ({
  open,
  handleClose,
  handleCancel,
  id,
  setTodoUpdate,
  todoUpdate,
}) => {
  const url = "http://localhost:5500/api/subtask";
  const [subtasks, setSubtasks] = useState([]);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("");

  //Delete the subtask
  const [openDialog, setOpenDialog] = useState(false); // State to control dialog visibility
  const [itemToDelete, setItemToDelete] = useState(null);
  const [delItem, setDelItem] = useState([]);

  //Variable
  const [titleText, setTitleText] = useState("");
  //Update Subtask
  const [updatetask, setUpdateTask] = useState("");

  //===== For Delete Operation ============
  //Handle Open Dialog for delete operation
  const handleOpenDialog = async (id) => {
    setOpenDialog(true);
    setItemToDelete(id);
  };

  //Handle Close Dialog for delete operation
  const handleCloseDialog = () => {
    setItemToDelete(null);
    setOpenDialog(false);
  };

  //Handle Cancel Dialog for delete operation
  const handleCancelDialog = () => {
    console.log("Cancel Clicked");
    setItemToDelete(null);
    handleCloseDialog();
  };

  //Close the alert
  const handleCloseAlert = () => {
    setShowAlert(false);
    setAlertMessage("");
    setAlertSeverity("");
  };

  //add Subtasks database
  const addSubtask = async (e) => {
    e.preventDefault();
    try {
      if (updatetask.length !== 0) {
        updateSubtask(updatetask, e);
      } else {
        if (titleText === "") {
          setAlertMessage("Enter all details");
          setAlertSeverity("warning");
          setShowAlert(true);
          return;
        }
        const res = await axios.post(`${url}`, {
          user_id: id.userId,
          todo_id: id.todoId,
          title: titleText,
        });
        setTitleText("");
        getSubtask();
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        // Handle 500 Internal Server Error
        setAlertMessage(error.response.data.error);
      } else {
        setAlertMessage("An error occurred");
      }
      setAlertSeverity("error");
      setShowAlert(true);    
    }
  };

  // Fetch subtasks on component mount
  const getSubtask = async () => {
    try {
      console.log(id.todoId + " " + id.userId);
      const res = await axios.get(
        `${url}?todo_id=${id.todoId}&user_id=${id.userId}`
      );
      setSubtasks(res.data); // Assuming that the response contains the subtasks data
    } catch (error) {
      if (error.response && error.response.status === 500) {
        // Handle 500 Internal Server Error
        setAlertMessage(error.response.data.error);
      } else {
        setAlertMessage("An error occurred");
      }
      setAlertSeverity("error");
      setShowAlert(true);    
    }
  };

  //Delete Item when click on delete
  const deleteItem = async (id, title, e) => {
    handleOpenDialog(id); // Open the dialog
    setDelItem(title);
    e.preventDefault();
  };

  const confirmDeleteItem = async () => {
    if (itemToDelete) {
      const delId = itemToDelete;
      const res = await axios.delete(`${url}`, { data: { id: delId } });
      handleCloseDialog();
      getSubtask();
    }
  };

  //Update Subtask
  const updateSubtask = async (item, e) => {
    try{
      e.preventDefault();
      const res = await axios.put(`${url}`, {
        id: item.id,
        title: item.title,
        status: item.status,
        todo_id: item.todo_id,
      });
      setTitleText("");
      setAlertMessage(res.data.message);
      setAlertSeverity("success");
      setShowAlert(true);
      setUpdateTask([]);
      getSubtask();
      setTodoUpdate("subtask");  
    }catch(error){
      if (error.response && error.response.status === 500) {
        // Handle 500 Internal Server Error
        setAlertMessage(error.response.data.error);
      } else {
        setAlertMessage("An error occurred");
      }
      setAlertSeverity("error");
      setShowAlert(true);    
    }
  };
  useEffect(() => {
    getSubtask();
    if (todoUpdate === "todo") {
      getSubtask();
      setTodoUpdate(null);
    }
  }, [id.todoId, id.userId, todoUpdate]);

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{ "& .MuiDialog-paper": { minWidth: "500px", maxWidth: "900px" } }}
      >
        <DialogTitle>SubTasks</DialogTitle>
        <DialogContent>
          <form action="" className="form" onSubmit={(e) => addSubtask(e)}>
            <input
              type="text"
              name="title"
              placeholder="Enter title"
              value={updatetask.title || titleText}
              onChange={(event) => {
                if (updatetask.length !== 0) {
                  // Handle update case
                  setUpdateTask({
                    ...updatetask,
                    title: event.target.value,
                  });
                } else {
                  // Handle add new item case
                  setTitleText(event.target.value);
                }
              }}
            />
            {updatetask.length !== 0 ? (
              <select
                className="custom-select"
                name="status"
                id="status"
                onChange={(e) => {
                  setUpdateTask({
                    ...updatetask,
                    status: e.target.value,
                  });
                }}
              >
                <option
                  value="In-Progress"
                  selected={updatetask.status === "In-Progress"}
                >
                  In-Progress
                </option>
                <option
                  value="Completed"
                  selected={updatetask.status === "Completed"}
                >
                  Completed
                </option>
                <option
                  value="On-Hold"
                  selected={updatetask.status === "On-Hold"}
                >
                  On-Hold
                </option>
              </select>
            ) : (
              " "
            )}

            <button type="submit">+</button>
            {showAlert && (
              <Alerts
                message={alertMessage}
                severitys={alertSeverity}
                onClose={() => {
                  handleCloseAlert();
                }}
              />
            )}
          </form>

          {subtasks === "No Sub Tasks" ? (
            <p>{subtasks}</p>
          ) : (
            subtasks.map((subtask) => (
              <div className="todo-item" key={subtask.id}>
                <p className="item-content">{subtask.title}</p>
                {/* <p className="item-content">{item.descp}</p> */}
                <p className="item-content">{subtask.status}</p>
                <img
                  className="update-item"
                  onClick={(e) => {
                    setUpdateTask(subtask);
                  }}
                  width="30"
                  height="30"
                  src="https://img.icons8.com/ios/50/edit--v1.png"
                  alt="edit--v1"
                />
                <img
                  className="delete-item"
                  onClick={(e) => {
                    deleteItem(subtask.id, subtask.title, e);
                  }}
                  width="50"
                  height="50"
                  src="https://img.icons8.com/carbon-copy/100/filled-trash.png"
                  alt="filled-trash"
                />
              </div>
            ))
          )}
        </DialogContent>
        <DialogActions>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCancel}
            aria-label="close"
            sx={{
              color: "red", // Set the color to red
              cursor: "pointer", // Add cursor pointer for better UX
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>

        </DialogActions>
      </Dialog>
      {/* Render your custom Dialog component for Delete Operation */}
      <CustomDialog
        open={openDialog}
        handleClose={handleCloseDialog}
        handleCancel={handleCancelDialog}
        handleDelete={confirmDeleteItem}
        itemName={delItem}
      />
    </div>
  );
};

export default SubTask;
