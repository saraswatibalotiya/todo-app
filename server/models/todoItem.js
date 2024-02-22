// Import mysql to create new schema
const { query } = require('express');
const mysql = require('mysql2');

// Create a MySQL connection
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Saras@17',
    database: 'toDoApp',
})

// Get Item from ToDo table
const getAllTodoItems = async (totalItem, page , userid) => {
    try {
        const offset = (page - 1) * totalItem; // Calculate the offset based on the page
        const sql = `SELECT * FROM TodoItem where user_id = ? LIMIT ${totalItem} OFFSET ${offset} `;
        const [rows] = await conn.promise().query(sql,[userid]);
        const [rows2] = await conn.promise().query(`SELECT COUNT(*) AS COUNT FROM TodoItem where user_id = ?`,[userid]);
        console.log("Get request called");
        console.log(rows2[0], "total count");
        const result = [rows2[0], ...rows];
        return result;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

// Add Item in ToDo table
const addToDoItem = async (item) => {
    try {
        await conn.promise().query(
            `CREATE TABLE IF NOT EXISTS TodoItem(
                id INT AUTO_INCREMENT PRIMARY KEY,
                title varchar(250) NOT NULL,
                descp varchar(250) NOT NULL,
                status varchar(250) NOT NULL,
                user_id int NOT NULL,
                category_id int NOT NULL,
                bookmark BOOLEAN,
                FOREIGN KEY (user_id) REFERENCES user(id),
                FOREIGN KEY (category_id) REFERENCES category(id)

            );
            `
        );

        console.log(item);
        const [result] = await conn.promise().query(
            'INSERT INTO TodoItem (title, descp, status,user_id,bookmark,category_id) VALUES (?, ?, ?, ?, ?,?)',
            [item.title, item.descp, 'In-Progress',item.userid,0,item.category_id]
        );

        console.log(result.insertId);

        const addedItem = {
            id: result.insertId,
            title: item.title,
            descp: item.descp,
            category_id : item.category_id,
            status: 'In-Progress'
        };

        console.log(addedItem);
        return addedItem;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
    // finally {
    //     conn.end();
    // }
}

// Update Item of ToDo table
const updateTodoItem = async (itemId, updatedFields) => {
    try {
        const [result] = await conn.promise().query(
            'UPDATE TodoItem SET title = ?, descp = ?, status = ? , category_id = ?  WHERE id = ?',
            [updatedFields.title, updatedFields.descp, updatedFields.status,updatedFields.category_id, itemId]
        );
        console.log(updatedFields.id,updatedFields.status)
        await conn.promise().query(
            `UPDATE subtask set status = ? where todo_id = ?`,[updatedFields.status,itemId]
        )
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Delete Item of ToDo table
const deleteTodoItem = async (id) => {
    try {
        const [result] = await conn.promise().query(
            'DELETE from TodoItem where id = ?',
            [id]
        );
        console.log("Delete called");
        return result;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

// Find item from ToDo table with title match
const findTodoItem = async (title, totalItem, page ,userid) => {
    try {
        const offset = (page - 1) * totalItem; // Calculate the offset based on the page
        const sql = `SELECT * FROM TodoItem WHERE title LIKE ?  AND user_id = ? LIMIT ${totalItem} OFFSET ${offset}`;
        const [rows] = await conn.promise().query(sql,[`%${title}%` , userid]);
        const [rows2] = await conn.promise().query(`SELECT COUNT(*) AS COUNT FROM TodoItem WHERE title LIKE ? AND user_id = ? `,[`%${title}%` , userid]);
        const result = [rows2[0], ...rows];
        console.log(result)
        return result;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

//Update Bookmark of ToDo table
const updateBookmark = async (id,bookmark)=>{
    try {
        const [result] = await conn.promise().query(
            'UPDATE TodoItem SET bookmark = ? WHERE id = ?',
            [bookmark, id]
        );

        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

//Get all bookmarks data
const getBookmark = async(totalItem,page , userid) => {
    try {
        const offset = (page - 1) * totalItem; // Calculate the offset based on the page
        const value = 1;
        const sql = `SELECT * FROM TodoItem WHERE bookmark = ? AND user_id = ? LIMIT ${totalItem} OFFSET ${offset}`;
        const [rows] = await conn.promise().query(sql,[value,userid]);
        console.log(rows +"from bookmark")
        const [rows2] = await conn.promise().query(`SELECT COUNT(*) AS COUNT FROM TodoItem WHERE bookmark = ? AND user_id = ? `,[value,userid]);
        console.log(rows+"from bookmark")
        const result = [rows2[0], ...rows];
        return result;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}
// Find item from ToDo table with completed status / on-hold / pending
const findTodoItemStatus = async (status, totalItem, page ,userid) => {
    try {
        const offset = (page - 1) * totalItem; // Calculate the offset based on the page
        const sql = `SELECT * FROM TodoItem WHERE status = ?  AND user_id = ? LIMIT ${totalItem} OFFSET ${offset}`;
        const [rows] = await conn.promise().query(sql, [status,userid]);
        const [rows2] = await conn.promise().query(`SELECT COUNT(*) AS COUNT FROM TodoItem WHERE status = ? AND user_id = ?`, [status,userid]);
        const result = [rows2[0], ...rows];
        return result;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

// Export a function to add a todo item to the MySQL database
module.exports = { getAllTodoItems, addToDoItem, updateTodoItem, findTodoItem, deleteTodoItem, findTodoItemStatus ,getBookmark,updateBookmark}