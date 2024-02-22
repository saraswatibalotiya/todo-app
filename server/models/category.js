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

// Add User in User table
const addCategory = async (category) => {
    try {
        await conn.promise().query(
            `CREATE TABLE IF NOT EXISTS category(
                id INT AUTO_INCREMENT PRIMARY KEY,
                category_name varchar(250) NOT NULL,
                display_name varchar(250) NOT NULL
            );
            `
        );
        const [check] = await conn.promise().query(
            'SELECT * FROM category WHERE category_name = ?',[category.category_name]
        );
        console.log(check.length);
        if(check.length > 0){
            return 'Category exist'
        }

        const [result] = await conn.promise().query(
            'INSERT INTO category (category_name,display_name) VALUES (?, ?)',
            [category.category_name, category.display_name]
        );

        console.log(result.insertId);

        const addCategory = {
            id: result.insertId,
            category_name:category.category_name,
            display_name: category.display_name,
        };

        console.log(addCategory);
        return addCategory;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

// Get User in User Table
const getCategoryById = async(category_id) => {
    try {
        const [rows] = await conn.promise().query('SELECT * FROM category WHERE id = ?',[category_id]);
        console.log(rows.length);
        console.log("iske rows");

        if(rows.length>0){
            return rows;
        }
        else{
            return 'No such category';
        }
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

// Get User in User Table
const getCategory= async() => {
    try {
        const [rows] = await conn.promise().query('SELECT * FROM category');
        return rows;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

// Delete Item of ToDo table
const deleteCategory = async (id) => {
    try {
        const [result] = await conn.promise().query(
            'DELETE from category where id = ?',
            [id]
        );
        return result;

    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

// Update Item of ToDo table
const updateCategory = async (updatedFields) => {
    try {
        const [result] = await conn.promise().query(
            'UPDATE category SET category_name = ?, display_name = ? WHERE id = ?',
            [updatedFields.category_name, updatedFields.display_name , updatedFields.cat_id]
        );
        console.log(result);

        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Export a function to add a todo item to the MySQL database
module.exports = { addCategory ,getCategory,deleteCategory,getCategoryById ,updateCategory} 