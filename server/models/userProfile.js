// Import mysql to create new schema
const { query } = require('express');
const mysql = require('mysql2');

// Create a MySQL connection
const getDbConfig  = require('../dbConfig'); // Import the database configuration function
const conn = mysql.createConnection(getDbConfig()); // Use the function to get the configuration


// Add User in User table
const createUser = async (user) => {
    try {
        await conn.promise().query(
            `CREATE TABLE IF NOT EXISTS user(
                id INT AUTO_INCREMENT PRIMARY KEY,
                username varchar(250) NOT NULL,
                email varchar(250) NOT NULL,
                password varchar(250) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );
            `
        );

        const [check] = await conn.promise().query(
            'SELECT * FROM USER WHERE username = ?',[user.username]
        );
        console.log(check.length);
        if(check.length > 0){
            return 'Username exist'
        }
        

        const [result] = await conn.promise().query(
            'INSERT INTO user (username, email, password) VALUES (?, ?, ? )',
            [user.username, user.email,user.password]
        );

        console.log(result.insertId);

        const addedItem = {
            id: result.insertId,
            username: user.username,
            email: user.email,
        };
        console.log(addedItem,"from user profile")

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

// Get User in User Table
const getUser = async(username) => {
    try {
        const [rows] = await conn.promise().query('SELECT * FROM user WHERE username = ?',[username]);
        console.log(rows.length);
        if(rows.length>0){
            return rows;
        }
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

// Export a function to add a todo item to the MySQL database
module.exports = { createUser ,getUser} 