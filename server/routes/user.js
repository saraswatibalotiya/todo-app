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
        console.log(newUser,"new User == ")

        if(newUser === 'Username exist'){
            res.status(409).json({error:"Username already exist"})
        }
        else{
            console.log(newUser,"new User == ")
            res.status(201).json({message:"Registeration done successfully!", data: newUser});//new user created
            return newUser
        }
    }
    catch(err){
        res.status(500).json({ error: 'Internal Server Error' });
        // res.json(err);
    }
})

// Get user from user table
router.get('/',async(req,res) => {
    try{
        const username = req.query.username;
        const user = await userModel.getUser(username);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'Not Found' }); // Added 404 Not Found
        }
    }
    catch(err){
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

module.exports = router;
