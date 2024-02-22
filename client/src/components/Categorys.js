import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AddCategory from "./AddCategory";
import CustomDialog from "./CustomDialog";
import { Button, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import useHistory from react-router-dom
import Header from "./Header";
const Categorys = () => {
  //URL
  const url = "http://localhost:5500/api/category";

  // Change route
  const { sessionId } = useParams();
  const navigate = useNavigate();

  //add item in list
  const [listCategory, setListCategory] = useState([]);

  //Delete
  const [openDialog, setOpenDialog] = useState(false); // State to control dialog visibility
  const [itemToDelete, setItemToDelete] = useState(null);
  const [delItem, setDelItem] = useState("");
  const [updateItem,setUpdateItem] = useState([])

  //Handle Category
  const todo = async (e) => {
    navigate(`/todo/${sessionId}`);
  };

  //Get Data of category from database
  const getCategoryList = async () => {
    try {
      let res;
      res = await axios.get(`${url}`);
      setListCategory(res.data);
    } catch (err) {
      console.log(err);
    }
  };

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

  //Delete Item when click on delete
  const deleteCategory = async (id, title, e) => {
    handleOpenDialog(id); // Open the dialog
    setDelItem(title);
    e.preventDefault();
  };

  const confirmDeleteCategory = async () => {
    if (itemToDelete) {
      try {
        const delId = itemToDelete;
        const res = await axios.delete(`${url}`, { data: { id: delId } });
        setItemToDelete(null);
        handleCloseDialog();
        getCategoryList();
      } catch (err) {
        console.log(err);
      }
    }
  };


  //Update ctegory when click on update
  const updateCategory = async (item, e) => {
    setUpdateItem(
      {
        cat_id : item.id,
        category_name : item.category_name,
        display_name : item.display_name
      }
    )

  }

  useEffect(() => {
    getCategoryList();
  }, []);

  return (
    <>
    <Header />

      <div className="Register">
      <h3>Category Master</h3>
        <AddCategory getCategoryList={getCategoryList} updateItem = {updateItem} setUpdateItem = {setUpdateItem}></AddCategory>
        <Grid container spacing={2} alignItems={"center"}>
          <Grid item alignItems={"center"} md={4.5}>
            <h3>Category Name</h3>
          </Grid>
          <Grid item alignItems={"center"} md={4.5}>
            <h3>Display Name</h3>
          </Grid>
          <Grid item alignItems={"center"} md={1}>
            <h3>Action</h3>
          </Grid>
        </Grid>
        
        {listCategory.map((item) => (
          <Grid container spacing={2} alignItems={"center"}>
          <Grid item  md={4}>
             <p className="item-content">{item.category_name}</p>
          </Grid>
          <Grid item alignItems={"center"} md={4}>
             <p className="item-content">{item.display_name}</p>
          </Grid>
          <Grid item alignItems={"center"} md={1}>
          <img
              className="update-item"
              onClick={(e) => {
                updateCategory(item, e);
              }}
              width="30"
              height="30"
              src="https://img.icons8.com/ios/50/edit--v1.png"
              alt="edit--v1"
            />
          </Grid>
          <Grid item alignItems={"center"} md={1}>
            <img
              className="delete-item"
              onClick={(e) => {
                deleteCategory(item.id, item.category_name, e);
              }}
              width="50"
              height="50"
              src="https://img.icons8.com/carbon-copy/100/filled-trash.png"
              alt="filled-trash"
            />
          </Grid>
        </Grid>
        ))}
        
        <CustomDialog
        open={openDialog}
        handleClose={handleCloseDialog}
        handleCancel={handleCancelDialog}
        handleDelete={confirmDeleteCategory}
        itemName={delItem}
        actionName={"Category"}
      />
      </div>
      </>

  );
};

export default Categorys;
