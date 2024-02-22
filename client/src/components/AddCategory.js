import React from "react";
import { useState } from "react";
import axios from "axios";
import Alerts from "./Alerts";
import { Button, Box } from "@mui/material";

const AddCategory = ({ getCategoryList, updateItem, setUpdateItem }) => {
  //URL
  const url = "http://localhost:5500/api/category";

  //Alert
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("");

  //Inputs
  const [displayText, setDisplayText] = useState("");
  const [categoryText, setCategoryText] = useState("");

  //For Alert
  const handleClose = () => {
    setShowAlert(false);
    setAlertMessage("");
    setAlertSeverity("");
  };

  const emptyFields = () => {
    setCategoryText("");
    setDisplayText("");
  };

  //Update category of items
  const updateCategory = async (e) => {
    e.preventDefault();
    const res = await axios.put(`${url}`, {
      category_name: updateItem.category_name,
      display_name: updateItem.display_name,
      cat_id: updateItem.cat_id,
    });
    setUpdateItem([]);
    setAlertMessage(res.data.message);
    setAlertSeverity("success");
    setShowAlert(true);
    getCategoryList();
  };
  //add new todo item to database
  const addCategory = async (e) => {
    console.log(updateItem);

    try {
      if (updateItem.length !== 0) {
        updateCategory(e);
      } else {
        e.preventDefault();
        const display = displayText;
        const category = categoryText;
        if (display === "" || category === "") {
          setAlertMessage("Enter all details");
          setAlertSeverity("warning");
          setShowAlert(true);
          return;
        }
        const res = await axios.post(`${url}`, {
          category_name: category,
          display_name: display,
        });
        if (res.data === "Category exist") {
          setAlertMessage("Category exist");
          setAlertSeverity("warning");
          setShowAlert(true);

        }
        setAlertMessage(res.data.message);
        setAlertSeverity("success");
        setShowAlert(true);
        emptyFields();
        getCategoryList();
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  return (
    <>
      <Box
        onSubmit={(e) => {
          addCategory(e);
        }}
        component="form"
        sx={{
          border: 1,
          borderColor: "grey.500",
          "& > :not(style)": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
        className="form"
      >
        <p style={{ width: "50ch" }}>Category</p>

        {updateItem.length !== 0 ? (
          <>
            <input
              type="text"
              placeholder="Enter Category"
              name="category"
              value={updateItem.category_name || ""}
              onChange={(e) =>
                setUpdateItem({ ...updateItem, category_name: e.target.value })
              }
            />
            <p style={{ width: "50ch" }}>Display Name</p>
            <input
              type="text"
              placeholder="Enter Display Name"
              name="display"
              value={updateItem.display_name || ""}
              onChange={(e) =>
                setUpdateItem({ ...updateItem, display_name: e.target.value })
              }
            />
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter Category"
              name="category"
              value={categoryText}
              onChange={(e) => setCategoryText(e.target.value)}
            />
            <p style={{ width: "50ch" }}>Display Name</p>
            <input
              type="text"
              placeholder="Enter Display Name"
              name="display"
              value={displayText}
              onChange={(e) => setDisplayText(e.target.value)}
            />
          </>
        )}
        <Button type="submit" variant="contained" color="secondary">
          Submit
        </Button>
        {showAlert && (
          <Alerts
            message={alertMessage}
            severitys={alertSeverity}
            onClose={() => {
              handleClose();
            }}
          />
        )}
      </Box>
    </>
  );
};

export default AddCategory;
