import "../App.css";
import * as React from "react";
import axios from "axios";
import { useState, useEffect,Fragment } from "react";
import { useParams } from "react-router-dom";
import CustomDialog from "./CustomDialog";
import { useNavigate } from "react-router-dom"; // Import useHistory from react-router-dom
import {
  Pagination,
  Select,
  MenuItem,
  FormControl,
  Grid,
  Box,
  InputLabel,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
} from "@mui/material";
import Header from './Header';
import Footer from "./Footer";
import TodoList from "./TodoList";
import AddItems from "./AddItems";
import SearchItem from "./SearchItem";

function HomePage() {
  //URL
  const url = "http://localhost:5500/api/item";
  // Change route
  const navigate = useNavigate();
  //Get session
  const { sessionId } = useParams();
  const [sessionData, setSessionData] = useState(null);
  const [isusername, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  //add item in list
  const [listItems, setListItems] = useState([]);

  //Pagination
  const [currPage, setCurrPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  //Delete
  const [openDialog, setOpenDialog] = useState(false); // State to control dialog visibility
  const [itemToDelete, setItemToDelete] = useState(null);
  const [delItem, setDelItem] = useState("");

  //Status
  const [selectStatus, setSelectStatus] = useState("All");
  //BookMark
  const [isLiked, setIsLiked] = useState(false);
  const [openBookmark, setOpenBookmark] = useState(false);

  //Search
  const [openSearch, setOpenSearch] = useState("");

  //Update
  const [updateData,setUpdateData] = useState([]);
  const [todoUpdate,setTodoUpdate] = useState(null); 


  //useeffect for session
  useEffect(() => {
    // Retrieve data from sessionStorage based on sessionId
    const dataFromSession = sessionStorage.getItem(sessionId);

    // Parse the data if needed
    const parsedData = JSON.parse(dataFromSession);

    // Update the state with the retrieved data
    setSessionData(parsedData[0]);
    setUserId(parsedData[0].id);
    setUsername(parsedData[0].username);
  }, [sessionId]);

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

  //Change current page
  useEffect(() => {
    setCurrPage(Math.min(currPage, totalPages));
  }, [totalPages, openSearch]);

  //Create function to fetch all todo items from database - using useEffect
  useEffect(() => {
    if (!openSearch || !openBookmark || sessionData != null || isLiked) {
      getItemsList();
    }
  }, [currPage, itemsPerPage, selectStatus, sessionData]);
  //Here the array of dependencies must be empty which means that the
  // getItemsList function will run only once

  //Get Data of ToDo items from database
  const getItemsList = async () => {
    try {
      let res;
      const userid = sessionData.id;
      if (selectStatus === "All") {
        setOpenBookmark(false);
        res = await axios.get(
          `${url}?totalItem=${itemsPerPage}&page=${currPage}&userid=${userid}`
        );
      }
      if (
        selectStatus === "Completed" ||
        selectStatus === "On-Hold" ||
        selectStatus === "In-Progress"
      ) {
        setOpenBookmark(false);
        res = await axios.get(
          `${url}/status?status=${selectStatus}&totalItem=${itemsPerPage}&page=${currPage}&userid=${userid}`
        );
      }
      const items = res.data.shift();
      //Calculate total pages based on the total number of items
      if (items.COUNT > 0) {
        const totCnt = Math.ceil(items.COUNT / itemsPerPage);
        setTotalPages(totCnt);
      }
      setListItems(res.data);
      setOpenSearch("");
    } catch (err) {
      console.log(err);
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
      const id = itemToDelete;
      try {
        const res = await axios.delete(`${url}/${id}`);
        setItemToDelete(null);
        handleCloseDialog();
        getItemsList();
      } catch (err) {
        console.log(err);
      }
    }
  };

  //Get bookmark data from database
  const bookmarkData = async () => {
    try {
      if (sessionData == null) {
        return;
      }
      // e.preventDefault();
      const res = await axios.get(
        `${url}/bookmarkItem?totalItem=${itemsPerPage}&page=${currPage}&userid=${sessionData.id}`
      );
      console.log(res.data.length);
      if (res.data.length > 1) {
        const items = res.data.shift();
        const totCnt = Math.ceil(items.COUNT / itemsPerPage);
        setTotalPages(totCnt);
        setListItems(res.data);
      }
      //Calculate total pages based on the total number of items
      else {
        setListItems([]);
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  //Handle BookMark and like button
  const handleLike = async (id, bookmark) => {
    try {
      if (sessionData == null) {
        return;
      }
      var currBookmark = 1;
      if (bookmark === 1) {
        currBookmark = 0;
      }
      // const like = !bookmark;
      const res = await axios.put(
        `${url}/bookmark/${id}?bookmark=${currBookmark}&userid=${sessionData.id}`
      );
      console.log("Bookmark Response : " + res);
      console.log(openBookmark + "open");
      if (openBookmark) {
        bookmarkData();
      } else {
        setIsLiked(false);
        getItemsList();
      }
    } catch (err) {
      console.log(err);
    }
  };

  //Chagne status usestate on click
  const checkStatus = async (e) => {
    e.preventDefault();
    if (e.target.value === "Bookmark") {
      setOpenBookmark(true);
      bookmarkData();
      setSelectStatus(e.target.value);
      setOpenSearch("");
    }
    setSelectStatus(e.target.value);
  };

  return (
    <>
    <Header />
    <div className="App">
      <Grid container spacing={2} alignItems={"center"}>
        <Grid item alignItems={"center"} md={6} sx={{ borderRight: 1 }}>
          <h1>Todoer</h1>
          <h4>What do you want to do today ?</h4>
          {/* Add item in TODO */}
          <AddItems
            getItemsList={getItemsList}
            setSelectStatus={setSelectStatus}
            sessionData={sessionData}
            updateData={updateData}
            setUpdateData = {setUpdateData}
            setTodoUpdate = {setTodoUpdate}
          />
        </Grid>
        <Grid item alignItems={"center"} md={6}>
        <SearchItem 
                    sessionData={sessionData}
                      setSelectStatus={setSelectStatus}
                      setOpenSearch={setOpenSearch}
                      itemsPerPage={itemsPerPage}
                      currPage={currPage}
                      setTotalPages={setTotalPages}
                      setListItems={setListItems}>
                      
          </SearchItem>
          <h2>Your Todo List</h2>
          {/* Todo List */}
          <FormControl>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              value={selectStatus}
              onChange={(e) => {
                checkStatus(e);
              }}
            >
              <FormControlLabel value="All" control={<Radio />} label="All" />
              <FormControlLabel
                value="Completed"
                control={<Radio />}
                label="Completed"
              />
              <FormControlLabel
                value="On-Hold"
                control={<Radio />}
                label="OnHold"
              />
              <FormControlLabel
                value="In-Progress"
                control={<Radio />}
                label="Pending"
              />
              <FormControlLabel
                value="Bookmark"
                control={<Radio />}
                label="Bookmark"
              />
            </RadioGroup>
          </FormControl>

          <TodoList
            listItems={listItems}
            deleteItem={deleteItem}
            setIsLiked={setIsLiked}
            handleLike={handleLike}
            userId={userId}
            setUpdateData = {setUpdateData}
            setTodoUpdate = {setTodoUpdate}
            todoUpdate = {todoUpdate}
            getItemsList={getItemsList}
          />
          {/* Pagination */}
          <FormControl fullWidth>
            <Grid container spacing={2} alignItems={"center"}>
              <Grid item alignItems={"center"} md={7}>
                {/* Pagination */}
                <Pagination
                  defaultPage={1}
                  count={totalPages}
                  page={currPage}
                  onChange={(event, value) => {
                    setCurrPage(value);
                  }}
                  color="secondary"
                  variant="outlined"
                />
              </Grid>
              <Grid item md={2} alignItems={"center"}>
                <Box sx={{ minWidth: 150 }}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Records Per Page
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="records"
                      value={itemsPerPage}
                      onChange={(event) => {
                        setItemsPerPage(event.target.value);
                      }}
                    >
                      <MenuItem value={3}>Three</MenuItem>
                      <MenuItem value={5}>Five</MenuItem>
                      <MenuItem value={8}>Eight</MenuItem>
                      <MenuItem value={10}>Ten</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </Grid>
          </FormControl>

          {/* Render your custom Dialog component for Delete Operation */}
          <CustomDialog
            open={openDialog}
            handleClose={handleCloseDialog}
            handleCancel={handleCancelDialog}
            handleDelete={confirmDeleteItem}
            itemName={delItem}
          />
        </Grid>
      </Grid>
    </div>
    <Footer/>
    </>
  );
}

export default HomePage;
