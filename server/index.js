const express = require('express');
const mysql = require('mysql2')
const dotenv = require('dotenv').config();
const cors = require('cors');
const getDbConfig = require('./dbConfig'); // Import the database configuration function
const app = express();

//use express.json() to get data into json format
app.use(express.json())

const PORT = process.env.PORT;

app.use(cors());

const TodoItemRoute = require('./routes/todoItem')
const categoryRoute = require('./routes/category')
const subtaskRoute = require('./routes/subtask')
const userRoute = require('./routes/user')

const connection = mysql.createConnection(getDbConfig()); // Use the function to get the configuration
connection.connect();

app.use('/api/item',TodoItemRoute);
app.use('/api/category',categoryRoute);
app.use('/api/subtask',subtaskRoute);
app.use('/api/user',userRoute);

// app.listen(PORT,()=>{
//     console.log(process.env.NODE_ENV)
//     console.log("server connected and running on "+PORT);
// })
module.exports = app; // Export the Express app