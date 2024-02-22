const router = require('express').Router();
//import user model
const userModel = require('../models/userProfile');

// Add user in user table
router.post('/',async(req,res) => {
    try{
        const {username,email,password} = req.body;

        const newUser = await userModel.createUser({
            username,email,password
        });
        console.log(newUser + 'new todo');
        res.status(200).json(newUser);
    }
    catch(err){
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
        // res.json(err);
    }
})

// Get user from user table
router.get('/',async(req,res) => {
    try{
        const username = req.query.username;
        const user = await userModel.getUser(username);
        res.status(200).json(user);
    }
    catch(err){
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
        // res.json(err);
    }
})

module.exports = router;