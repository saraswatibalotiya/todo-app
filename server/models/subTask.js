// Import mysql to create new schema
const { query } = require("express");
const mysql = require("mysql2");

// Create a MySQL connection
const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Saras@17",
  database: "toDoApp",
});

const statusTodo = [
  {
    priority: 3,
    name: "In-Progress",
  },
  {
    priority: 2,
    name: "On-Hold",
  },
  {
    priority: 1,
    name: "Completed",
  },
];
// Add User in User table
const createSubTask = async (todo) => {
  try {
    await conn.promise().query(
      `CREATE TABLE IF NOT EXISTS subTask(
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                todo_id INT NOT NULL,
                title varchar(250) NOT NULL,
                status varchar(250) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES user(id),
                FOREIGN KEY (todo_id) REFERENCES TodoItem(id),
                ON DELETE CASCADE
            );
            `
    );

    const [result] = await conn
      .promise()
      .query(
        "INSERT INTO subTask (user_id, todo_id,title,status) VALUES (?, ?, ? ,?)",
        [todo.user_id, todo.todo_id, todo.title, "In-Progress"]
      );

    console.log(result.insertId);

    const addedSubTask = {
      id: result.insertId,
      user_id: todo.user_id,
      todo_id: todo.todo_id,
      title: todo.title,
      status: todo.status,
    };

    console.log(addedSubTask);
    return addedSubTask;
  } catch (error) {
    console.log(error);
    throw error;
  }
  // finally {
  //     conn.end();
  // }
};

// Get User in User Table
const getSubTask = async (user_id, todo_id) => {
  try {
    const [rows] = await conn
      .promise()
      .query("SELECT * FROM subTask WHERE user_id = ? AND todo_id = ?", [
        user_id,
        todo_id,
      ]);
    console.log(rows.length);
    if (rows.length > 0) {
      return rows;
    } else {
      return "No Sub Tasks";
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Delete Item of ToDo table
const deleteSubTask = async (id) => {
  try {
    const [result] = await conn
      .promise()
      .query("DELETE from subTask where id = ?", [id]);
    console.log(id);
    console.log(result);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//Update subtask of todo table
// Update Item of ToDo table
const updateSubtask = async (updatedFields) => {
  try {
    const [result] = await conn
      .promise()
      .query("UPDATE subtask SET title = ?, status = ?  WHERE id = ?", [
        updatedFields.title,
        updatedFields.status,
        updatedFields.id,
      ]);
    const todo_id = updatedFields.todo_id;
    const [status] = await conn
      .promise()
      .query(
        "Select count(status) as count,status from subtask where todo_id = ? group by status ORDER BY count DESC ",
        [todo_id]
      );

    console.log(status);
    if (status.length > 0) {
      let majorityStatus = status[0].status; // The first element is the majority status
      // If there are two statuses with the same count, prioritize according to the predefined priority array
      if (status.length === 2 && status[0].count === status[1].count) {
        const sortedStatus = status.sort(
          (a, b) =>
            statusTodo.find((s) => s.name === a.status).priority -
            statusTodo.find((s) => s.name === b.status).priority
        );

        majorityStatus = sortedStatus[0].status;
      }

      const [updateTodoStatus] = await conn
        .promise()
        .query("UPDATE todoItem SET status = ? WHERE id = ?", [
          majorityStatus,
          todo_id,
        ]);
      console.log(updateTodoStatus);
    }
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Export a function to add a todo item to the MySQL database
module.exports = { createSubTask, getSubTask, deleteSubTask, updateSubtask };
