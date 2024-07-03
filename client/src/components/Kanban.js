import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Pagination,
  Select,
  MenuItem,
  FormControl,
  Grid,
  Box,
  InputLabel,
} from "@mui/material";

const Kanban = () => {
  //URL
  const url = "http://localhost:5500/api/item";

  //Get session
  const { sessionId } = useParams();
  const [userId, setUserId] = useState("");

  //Check where session useeffect as run or not
  const [firstEffectCompleted, setFirstEffectCompleted] = useState(false);

  //Pagination
  const [currPage, setCurrPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  //Status
  const [todoId, setTodoId] = useState();

  //add item in list
  const [wipItems, setWipItems] = useState([]);
  const [onHoldItems, setOnHoldItems] = useState([]);
  const [completedItems, setCompletedItems] = useState([]);

  //useeffect for session
  useEffect(() => {
    const dataFromSession = sessionStorage.getItem(sessionId);
    const parsedData = JSON.parse(dataFromSession);
    console.log(parsedData[0].id, "user id ===");
    setItemsList(parsedData[0].id);
    setFirstEffectCompleted(true);
    console.log("came here=========");
  }, [sessionId]);

  //   useEffect(()=>{
  // },[currPage])

  // //Change current page
  useEffect(() => {
    console.log(currPage, totalPages, "in use Effect 2");

    if (firstEffectCompleted) {
      console.log(currPage, totalPages, "in use Effect 2");
      setCurrPage(Math.min(currPage, totalPages));
    }
  }, [totalPages, firstEffectCompleted]);

  //Create function to fetch all todo items from database - using useEffect
  useEffect(() => {
    if (firstEffectCompleted) {
      console.log(currPage, totalPages, "in use Effect 1");

      setItemsList(userId);
    }
  }, [currPage, itemsPerPage, firstEffectCompleted]);

  //Get Data of ToDo items from database
  const setItemsList = async (userId) => {
    console.log("setItemsList before try catch");
    try {
      console.log("setItemsList in try ");

      console.log("user id === se item list", userId);
      if (!firstEffectCompleted) {
        setUserId(userId);
      }
      console.log(itemsPerPage, currPage, "== wipRes ==");

      const wipRes = await axios.get(
        `${url}/status?status=In-Progress&totalItem=${itemsPerPage}&page=${currPage}&userid=${userId}`
      );
      const completedRes = await axios.get(
        `${url}/status?status=Completed&totalItem=${itemsPerPage}&page=${currPage}&userid=${userId}`
      );

      const onHoldRes = await axios.get(
        `${url}/status?status=On-Hold&totalItem=${itemsPerPage}&page=${currPage}&userid=${userId}`
      );
      const wipResItems = wipRes.data.shift();
      const completedResItems = completedRes.data.shift();
      const onHoldResItems = onHoldRes.data.shift();

      //Calculate total pages based on the total number of items
      let wipResTotCnt = null,
        completedResTotCnt = null,
        onHoldResTotCnt = null;
      if (wipResItems.COUNT > 0) {
        wipResTotCnt = Math.ceil(wipResItems.COUNT / itemsPerPage);
        setWipItems(wipRes.data);
      }
      if (completedResItems.COUNT > 0) {
        completedResTotCnt = Math.ceil(completedResItems.COUNT / itemsPerPage);
        setCompletedItems(completedRes.data);
      }
      if (onHoldResItems.COUNT > 0) {
        onHoldResTotCnt = Math.ceil(onHoldResItems.COUNT / itemsPerPage);
        setOnHoldItems(onHoldRes.data);
      }
      const totalCount = Math.max(
        wipResTotCnt,
        completedResTotCnt,
        onHoldResTotCnt
      );
      console.log(
        wipResTotCnt,
        completedResTotCnt,
        onHoldResTotCnt,
        "set item list all count ==="
      );

      console.log(totalCount, "set item list ===");
      setTotalPages(totalCount);
    } catch (error) {
      console.log("setItemsList before in catch");

      console.log("error");
    }

    // if (true) {
    //   res = await axios.get(
    //     `${url}/status?status=Completed&totalItem=${itemsPerPage}&page=${currPage}&userid=${userId}`
    //   );
    //   const items = res.data.shift();
    //   //Calculate total pages based on the total number of items
    //   if (items.COUNT > 0) {
    //     const totCnt = Math.ceil(items.COUNT / itemsPerPage);
    //     setTotalPages(totCnt);
    //   }
    //   setCompletedItems(res.data);
    // }
    // if (true) {
    //   res = await axios.get(
    //     `${url}/status?status=In-Progress&totalItem=${itemsPerPage}&page=${currPage}&userid=${userId}`
    //   );
    //   const items = res.data.shift();
    //   //Calculate total pages based on the total number of items
    //   if (items.COUNT > 0) {
    //     const totCnt = Math.ceil(items.COUNT / itemsPerPage);
    //     setTotalPages(totCnt);
    //   }
    //   setWipItems(res.data);
    // }
    // if (true) {
    //   res = await axios.get(
    //     `${url}/status?status=On-Hold&totalItem=${itemsPerPage}&page=${currPage}&userid=${userId}`
    //   );
    //   const items = res.data.shift();
    //   //Calculate total pages based on the total number of items
    //   if (items.COUNT > 0) {
    //     const totCnt = Math.ceil(items.COUNT / itemsPerPage);
    //     setTotalPages(totCnt);
    //   }
    //   setOnHoldItems(res.data);
    // }
  };

  const onDragStart = (todoId) => {
    console.log("dragstart:", todoId);
    setTodoId(todoId);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = async (status) => {
    console.log(status, todoId, "==== on drop =====");
    const res = await axios.put(`${url}`, {
      id: todoId,
      status: status,
    });
    console.log(res);
    console.log(userId, "user id in drop");
    setItemsList(userId);
  };

  return (
    <div className="container-drag">
      <Header />
      <div className="kanban-content">
        <div
          className="in-progress"
          onDragOver={(e) => onDragOver(e)}
          onDrop={() => onDrop("In-Progress")}
        >
          <h3 className="task-header">In Progress</h3>
          {wipItems.map((item) => (
            <div
              key={item.id} // Assuming each task has a unique id
              onDragStart={() => onDragStart(item.id)}
              draggable
              className="draggable"
            >
                {item.title}
            </div>
          ))}
        </div>
        <div
          className="On-Hold"
          onDragOver={(e) => onDragOver(e)}
          onDrop={() => onDrop("On-Hold")}
        >
          <h3 className="task-header">On Hold</h3>
          {onHoldItems.map((item) => (
            <div
              key={item.id} // Assuming each task has a unique id
              onDragStart={() => onDragStart(item.id)}
              draggable
              className="draggable"
            >
              {item.title}
            </div>
          ))}
        </div>
        <div
          className="completed"
          onDragOver={(e) => onDragOver(e)}
          onDrop={() => onDrop("Completed")}
        >
          <h3 className="task-header">Completed</h3>
          {completedItems.map((item) => (
            <div
              key={item.id} // Assuming each task has a unique id
              onDragStart={() => onDragStart(item.id)}
              draggable
              className="draggable"
            >
              {item.title}
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="pagination-container">
        <FormControl>
          <Grid container spacing={2} alignItems={"center"}>
            <Grid item alignItems={"center"} md={7}>
              {/* Pagination */}
              <Pagination
                defaultPage={1}
                count={totalPages}
                page={currPage}
                onChange={(event, value) => {
                  console.log("Pagination onChange - New value:", value);
                  console.log("Current page before update:", currPage);
                  if (!isNaN(value)) {
                    setCurrPage(value);
                    console.log("Current page after update:", value);
                  }
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
      </div>

      <Footer />
    </div>
  );
};

export default Kanban;
