// TodoList.js
import React, { useEffect } from "react";
import "../App.css";
import { useState } from "react";
import {  Grid } from "@mui/material";
import SubTask from "./SubTask";

function TodoList({
  listItems,
  deleteItem,
  setIsLiked,
  handleLike,
  userId,
  setUpdateData,
  setTodoUpdate,
  todoUpdate,
  getItemsList
}) {

  const [Id, setId] = useState({ todoId: null, userId: null });
  const [openDialog, setOpenDialog] = useState(false); // State to control dialog visibility

  // Update Item
  const updateTodo = async (item, e) => {
    setUpdateData(item);
  };

  useEffect(()=>{
    if(todoUpdate === 'subtask'){
      getItemsList();
      setTodoUpdate(null);
    }
  },[todoUpdate])

  //===== For Subtask Operation ============
  //Handle Open Dialog for delete operation
  const handleOpenDialog = async (todoid, userid) => {
    setId({ todoId: todoid, userId: userid });
    setOpenDialog(true);
  };

  //Handle Close Dialog for delete operation
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  //Handle Cancel Dialog for delete operation
  const handleCancelDialog = () => {
    console.log("Cancel Clicked");
    handleCloseDialog();
  };
  return (
    <div className="todo-listItems">
      <Grid container spacing={2} alignItems={"center"}>
        <Grid item alignItems={"center"} md={4.5}>
          <h3>Title</h3>
        </Grid>
        <Grid item alignItems={"center"} md={4.5}>
          <h3>Status</h3>
        </Grid>
        <Grid item alignItems={"center"} md={1}>
          <h3>Action</h3>
        </Grid>
      </Grid>
      {listItems.map((item) => (
        <div className="todo-item" key={item.id}>
          <img
            width="25"
            height="25"
            onClick={() => {
              handleOpenDialog(item.id, userId);
            }}
            src="https://img.icons8.com/ios/50/add--v1.png"
            alt="add--v1"
          />
          <p className="item-content">{item.title}</p>
          {/* <p className="item-content">{item.descp}</p> */}
          <p className="item-content">{item.status}</p>
          {/* <button className="update-item">Update</button> */}
          <img
            className="update-item"
            onClick={(e) => {
              updateTodo(item, e);
            }}
            width="30"
            height="30"
            src="https://img.icons8.com/ios/50/edit--v1.png"
            alt="edit--v1"
          />
          <img
            className="delete-item"
            onClick={(e) => {
              deleteItem(item.id, item.title, e);
            }}
            width="50"
            height="50"
            src="https://img.icons8.com/carbon-copy/100/filled-trash.png"
            alt="filled-trash"
          />
          <button
            variant="outlined"
            onClick={() => {
              setIsLiked(true);
              handleLike(item.id, item.bookmark);
            }}
          >
            {item.bookmark === 1 ? (
              <img
                width="35"
                height="35"
                src="https://img.icons8.com/ios-filled/50/like--v1.png"
                alt="like--v1"
              />
            ) : (
              <img
                width="35"
                height="35"
                src="https://img.icons8.com/ios/50/000000/like--v1.png"
                alt="like--v1"
              />
            )}
          </button>
        </div>
      ))}
      {/* Render your custom Dialog component for Delete Operation */}
      <SubTask
        open={openDialog}
        handleClose={handleCloseDialog}
        handleCancel={handleCancelDialog}
        id={Id}
        setTodoUpdate={setTodoUpdate}
        todoUpdate={todoUpdate}
      />
    </div>
  );
}

export default TodoList;
