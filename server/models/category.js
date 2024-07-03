// Import mysql to create new schema
const { query } = require('express');
const mysql = require('mysql2');
// Create a MySQL connection
const getDbConfig  = require('../dbConfig'); // Import the database configuration function
const conn = mysql.createConnection(getDbConfig()); // Use the function to get the configuration
// Add Category in Category table
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
        // console.log(check.length);
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
        return addCategory;
    }
    catch (error) {
        console.log(error,"add error ");
        throw error;
    }
}

// Get Category in Category Table By ID
const getCategoryById = async(totalItem, page ,category_id) => {
    try {
        const offset = (page - 1) * totalItem; // Calculate the offset based on the page
        const sql = `SELECT * FROM category where id = ? LIMIT ${totalItem} OFFSET ${offset} `;
        const [rows] = await conn.promise().query(sql,[category_id]);
        const [rows2] = await conn.promise().query(`SELECT COUNT(*) AS COUNT FROM category where id = ?`,[category_id]);
        const result = [rows2[0], ...rows];
        return result;

        // const [rows] = await conn.promise().query('SELECT * FROM category WHERE id = ?',[category_id]);
        // console.log(rows.length);
        // console.log("iske rows");

        // if(rows.length>0){
        //     return rows;
        // }
        // else{
        //     return 'No such category';
        // }
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

// Get Category in Category Table
const getCategory= async(totalItem, page) => {
    try {
        const offset = (page - 1) * totalItem; // Calculate the offset based on the page
        const sql = `SELECT * FROM category  LIMIT ${totalItem} OFFSET ${offset} `;
        const [rows] = await conn.promise().query(sql);
        const [rows2] = await conn.promise().query(`SELECT COUNT(*) AS COUNT FROM category`);
        const result = [rows2[0], ...rows];
        return result;
        // const [rows] = await conn.promise().query('SELECT * FROM category');
        // return rows;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

//Get Categoy without pagination
const getCategoryNoPagination = async()=>{
    try {
        const [rows] = await conn.promise().query('SELECT * FROM category');
        return rows;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

// Delete Category of ToDo table
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

// Update Item of Category table
const updateCategory = async (updatedFields) => {
    try {
        const [result] = await conn.promise().query(
            'UPDATE category SET category_name = ?, display_name = ? WHERE id = ?',
            [updatedFields.category_name, updatedFields.display_name , updatedFields.cat_id]
        );

        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Export a function to add a todo item to the MySQL database
module.exports = { addCategory ,getCategory,deleteCategory,getCategoryById ,updateCategory,getCategoryNoPagination} 