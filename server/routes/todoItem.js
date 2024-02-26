const router = require('express').Router();
// import todo model
const todoItemsModel = require('../models/todoItem');

// Add Item in ToDo table
router.post('/',async(req,res) => {
    try{
        const {title,descp,userid,category_id} = req.body;

        const newTodo = await todoItemsModel.addToDoItem({
            title,descp,userid,category_id
        });
        // console.log(newTodo + 'new todo');
        res.status(201).json({message : "ToDo Item added Successfully"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
        // res.json(err);
    }
})

// Find item from ToDo table according to status
router.get('/status',async(req,res)=>{
    try{
        console.log("Rotuer called");
        const totalItem = req.query.totalItem;
        const page = req.query.page;
        const itemStatus = req.query.status;
        const userid = req.query.userid;
        const getItem = await todoItemsModel.findTodoItemStatus(itemStatus,totalItem,page,userid);
        res.status(200).json(getItem);
    }
    catch(err){
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


// Get Item from ToDo table
router.get('/', async (req,res)=>{
    try{
        const totalItem = req.query.totalItem;
        const page = req.query.page;
        const userid = req.query.userid;
        console.log(totalItem,page);
        const allItems = await todoItemsModel.getAllTodoItems(totalItem,page,userid);
        res.status(200).json(allItems);
    }
    catch(error){
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
        // res.json(err);
    }
}) 


// Update Item of ToDo table
router.put('/:id',async(req,res)=>{
    try{
        const itemId = req.params.id;
        const updatedFields = req.body;
    
        const updateItem = await todoItemsModel.updateTodoItem(itemId,updatedFields);
        res.status(200).json({message:"ToDo Item updated Successfully!"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

// Delete Item of ToDo table
router.delete('/:id',async(req,res)=>{
    try{
        const id = req.params.id;
        const deleteItem = await todoItemsModel.deleteTodoItem(id);
        res.status(200).json({message:"Item deleted successfully!"});

    }
    catch (err){
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


// Find item from ToDo table
router.get('/:title',async(req,res)=>{
    try{
        const itemTitle = req.params.title;
        const totalItem = req.query.totalItem;
        const page = req.query.page;
        const userid = req.query.userid;
        const getItem = await todoItemsModel.findTodoItem(itemTitle,totalItem,page,userid);
        res.status(200).json(getItem);
    }
    catch(err){
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


//Update Bookmark in ToDo Table
router.put('/bookmark/:id',async(req,res)=>{
    try{
        const itemId = req.params.id;  
        const bookmark = req.query.bookmark;  
        const updateItem = await todoItemsModel.updateBookmark(itemId,bookmark);
        res.status(200).json(updateItem);
    }
    catch(err){
        console.log(err);
        res.json(err);
    }
})

//Get Bookmark Data from Todo Table
router.get('/bookmark/:userid',async(req,res)=>{
    try{
        const totalItem = req.query.totalItem;
        const page = req.query.page;
        const userid = req.params.userid;
        const getItem = await todoItemsModel.getBookmark(totalItem,page,userid);
        console.log(getItem.data);
        res.status(200).json(getItem);
    }
    catch(err){
        console.log(err);
        res.json(err);
    }
})

module.exports = router;