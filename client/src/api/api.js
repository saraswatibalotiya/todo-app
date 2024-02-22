// src/api/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5500/api/item';

//Add Items in ToDo
 const addItemApi = async (title, descp) => {
  try {
    const res = await axios.post(API_URL, { title, descp });
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

//Get Items
 const getItemsListApi = async () => {
  try {
    const res = await axios.get(API_URL);
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

//Delete Items
 const deleteItemApi = async (id) => {
  try {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

//Update Items
 const updateItemApi = async (id, title, descp, status) => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, { title, descp, status });
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = {addItemApi,getItemsListApi,deleteItemApi,updateItemApi};