const express = require('express');
const mysql = require('mysql2')
const dotenv = require('dotenv').config();
const cors = require('cors');

const app = express();

//use express.json() to get data into json format
app.use(express.json())

const PORT = process.env.PORT || 5500;

app.use(cors());

const TodoItemRoute = require('./routes/todoItem')
const categoryRoute = require('./routes/category')
const subtaskRoute = require('./routes/subtask')
const userRoute = require('./routes/user')

// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Saras@17',
  database: 'toDoApp',
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// When you're done with the connection, close it
// connection.end(); 

// Optionally, listen for connection errors
connection.on('error', (err) => {
  console.error('MySQL connection error:', err);
});

app.use('/api/item',TodoItemRoute);
app.use('/api/category',categoryRoute);
app.use('/api/subtask',subtaskRoute);
app.use('/api/user',userRoute);




app.listen(PORT,()=>{
    console.log("server connected and running on "+PORT);

})