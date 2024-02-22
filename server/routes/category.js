const router = require('express').Router();
// Import category Model
const categoryModel = require('../models/category')

// Add category in category table
router.post('/',async(req,res) => {
    try{
        const {category_name,display_name} = req.body;
        const newCategory = await categoryModel.addCategory({
            category_name,display_name
        });
        console.log(newCategory + 'new category');
        res.status(200).json({message : "Category created Successfully!"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

// Update category in category table
router.put('/',async(req,res)=>{
    try{
        const category_name = req.body.category_name;
        const display_name = req.body.display_name;
        const cat_id = req.body.cat_id;
        const updateCategory = await categoryModel.updateCategory({
            category_name,display_name,cat_id
        });
        console.log(req.body);
        console.log(updateCategory);
        console.log("update category");
        res.status(200).json({message : "Category updated Successfully!"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

// Get category  By id
router.get('/:category_id',async(req,res) => {
    try{
        const category_id = req.params.category_id;
        const category = await categoryModel.getCategoryById(category_id);
        res.status(200).json(category);
    }
    catch(err){
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

// Get Subtask 
router.get('/',async(req,res) => {
    try{
        const category = await categoryModel.getCategory();
        res.status(200).json(category);
    }
    catch(err){
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

//Delete category in category table
router.delete('/',async(req,res)=>{
    try{
        const id = req.body.id;
        console.log(id);
        const deleteItem = await categoryModel.deleteCategory(id);
        console.log(deleteItem.affectedRows);
        console.log("iske upar");

        if(deleteItem.affectedRows > 0){
            res.status(200).json({message : "SubTask deleted successfully!"});
        }
        else{
            res.status(404).json({message :deleteItem} );
        }
    }
    catch (err){
        console.log(err);
        res.json(err);
    }
})

module.exports = router;