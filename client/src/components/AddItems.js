import "../App.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Alerts from "./Alerts";
import {
  Button,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";

const AddItems = ({
  setSelectStatus,
  getItemsList,
  sessionData,
  updateData,
  setUpdateData,
  setTodoUpdate
}) => {
  //url
  const url = "http://localhost:5500/api/item";
  const catUrl = "http://localhost:5500/api/category/all";

  //Alert
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [categoryText, setCategoryText] = useState("");

  //Close the alert
  const handleClose = () => {
    setShowAlert(false);
    setAlertMessage("");
    setAlertSeverity("");
  };

  //Update todo item
  const updateItems = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `http://localhost:5500/api/item/${updateData.id}`,
        {
          title: updateData.title,
          descp: updateData.descp,
          status: updateData.status,
          category_id: updateData.category_id,
        }
      );
      setUpdateData([]);
      console.log(res.data);
      e.target.title.value = "";
      e.target.descp.value = "";
      setAlertMessage(res.data.message);
      setAlertSeverity("success");
      setShowAlert(true);
      getItemsList();
      setTodoUpdate('todo');
    } catch (err) {
      console.log(err);
      throw err;
    }
  };
  //add new todo item to database
  const addItem = async (e) => {
    e.preventDefault();
    try {
      if (updateData.length !== 0) {
        updateItems(e);
      } else {
        const titleText = e.target.title.value;
        const descpText = e.target.descp.value;
        if (titleText === "" || descpText === "" || categoryText === "") {
          setAlertMessage("Enter all details");
          setAlertSeverity("warning");
          setShowAlert(true);
          return;
        }
        const res = await axios.post(`${url}`, {
          title: titleText,
          descp: descpText,
          userid: sessionData.id,
          category_id: categoryText,
        });
        getItemsList();
        setSelectStatus("All");
        e.target.title.value = "";
        e.target.descp.value = "";
        setCategoryText("");
        setAlertMessage(res.data.message);
        setAlertSeverity("success");
        setShowAlert(true);
        return;
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  //Get Category
  const getCategory = async () => {
    const res = await axios.get(`${catUrl}`);
    setCategoryList(res.data);
    console.log(res);
  };

  useEffect(() => {
    getCategory();
  }, []);

  return (
    <>
      <div className="Register">
        <Box
          onSubmit={(e) => {
            addItem(e);
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
          <p style={{ width: "50ch" }}>Title</p>
          <input
            type="text"
            placeholder="Enter title"
            name="title"
            value={updateData.title || null}
            onChange={(event) => {
              if (updateData.length !== 0) {
                // Handle update case
                setUpdateData({ ...updateData, title: event.target.value });
              }
            }}
          />
          <p style={{ width: "50ch" }}>Description</p>
          <input
            type="text"
            placeholder="Enter description"
            name="descp"
            value={updateData.descp || null}
            onChange={(event) => {
              if (updateData.length !== 0) {
                // Handle update case
                setUpdateData({ ...updateData, descp: event.target.value });
              }
            }}
          />
          {/* <p style={{ width: "42ch" }}>Category</p> */}
          <Box sx={{ minWidth: 150 }} style={{ width: "42ch" }}>
            <FormControl fullWidth>
              <InputLabel
                id="demo-simple-select-label"
                style={{ width: "42ch" }}
              >
                Select Category
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="records"
                value={updateData.category_id || categoryText}
                onChange={(event) => {
                  if (updateData.length !== 0) {
                    // Handle update case
                    setUpdateData({
                      ...updateData,
                      category_id: event.target.value,
                    });
                  } else {
                    // Handle add new item case
                    setCategoryText(event.target.value);
                  }
                }}
                style={{ width: "50ch" }}
              >
                {categoryList.map((catItem) => (
                  <MenuItem key={catItem.id} value={catItem.id}>
                    {catItem.display_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          {
              updateData.length!== 0
              ?
            <Box sx={{ minWidth: 150 }} style={{ width: "42ch" }}>
              <FormControl fullWidth>
                <InputLabel
                  id="demo-simple-select-label"
                  style={{ width: "42ch" }}
                >
                  Select Status
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="records"
                  value={updateData.status}
                  onChange={(event) => {
                      setUpdateData({
                        ...updateData,
                        status: event.target.value,
                      });
                   
                  }}
                  style={{ width: "42ch" }}
                >
                    <MenuItem value="In-Progress">In-Progress</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                    <MenuItem value="On-Hold">On-Hold</MenuItem>
                </Select>
              </FormControl>
            </Box>
            :
            " "
          }

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
      </div>
    </>
  );
};

export default AddItems;
