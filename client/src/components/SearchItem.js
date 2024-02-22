import Alerts from "./Alerts";
import React, {  useState } from "react";
import axios from "axios";



const SearchItem = ({ 

    setSelectStatus,
  getItemsList,
  sessionData,
  itemsPerPage,
  currPage,
  setTotalPages,
  setListItems,
  setOpenSearch,
  openSearch,
  updateData,
  setUpdateData,
}) => {
    console.log(sessionData)
    // url
    const url = "http://localhost:5500/api/item";
      //Alert
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("");


  //Search Item
  const searchItem = async (e) => {
    try {
    //   if (sessionData == null) {
    //     return;
    //   }
      e.preventDefault();
      const searchValue = e.target.search.value;
      if (searchValue === "") {
        setAlertMessage("Enter the item to search in TODO List");
        setAlertSeverity("warning");
        setSelectStatus("All");
        setOpenSearch("");
        setShowAlert(true);
        return;
      }
      const res = await axios.get(
        `${url}/${searchValue}?totalItem=${itemsPerPage}&page=${currPage}&userid=${sessionData.id}`
      );
      const items = res.data.shift();
      //Calculate total pages based on the total number of items
      if (items.COUNT > 0) {
        const totCnt = Math.ceil(items.COUNT / itemsPerPage);
        setTotalPages(totCnt);
        setListItems(res.data);
        setOpenSearch(searchValue);
        setSelectStatus("");
        return;
      } else {
        setAlertMessage("No such item in TODO List");
        setAlertSeverity("warning");
        setSelectStatus("All");
        setOpenSearch("");
        setShowAlert(true);
        return;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  return (
    <form
      className="form"
      onSubmit={(e) => {
        searchItem(e);
      }}
    >
      <input
        type="text"
        name="search"
        placeholder="Search with title"
        value={openSearch}
        onChange={(e) => setOpenSearch(e.target.value)}
      />
      <button
        type="submit"
        style={{ border: "none", background: "none", cursor: "pointer" }}
      >
        <img
          width="40"
          height="40"
          src="https://img.icons8.com/ios/50/search--v1.png"
          alt="search--v1"
        />
      </button>
    </form>
  );
};

export default SearchItem;
