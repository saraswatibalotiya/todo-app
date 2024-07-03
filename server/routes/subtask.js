const router = require('express').Router();
// Import subTask Model
const subtaskModel = require('../models/subTask')

// Add Subtask in subTask table
router.post('/',async(req,res) => {
    try{
        const {user_id,todo_id,title} = req.body;

        const newSubTask = await subtaskModel.createSubTask({
            user_id,todo_id,title
        });
        console.log(newSubTask + 'new subtask');
        res.status(201).json(newSubTask);
    }
    catch(err){
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

// Get Subtask in subTask table
router.get('/',async(req,res) => {
    try{
        const todo_id = req.query.todo_id;
        const user_id = req.query.user_id;
        const user = await subtaskModel.getSubTask(user_id,todo_id);
        res.status(200).json(user);
    }
    catch(err){
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
        // res.json(err);
    }
})

//Delete Subtask in sutTask table
router.delete('/',async(req,res)=>{
    try{
        const id = req.body.id;
        console.log(id);
        const deleteItem = await subtaskModel.deleteSubTask(id);
        console.log(deleteItem);
        res.status(200).json({message:"SubTask deleted successfully!"});
    }
    catch (err){
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

//Update Subtask in subTask table
router.put('/',async(req,res)=>{
    try{
        const updatedFields = req.body;
        console.log(updatedFields)
        const data = await subtaskModel.updateSubtask(updatedFields);
        console.log(data);
        res.status(200).json({message:"Successfully updated subtask"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
        // res.json(err);
    }

})

module.exports = router;