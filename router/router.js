const express = require('express');
const router = express.Router();
const path = require('path')
const User = require('../models/userModel');
const connection = require("../database");

router.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, '..', 'pages', 'home.html'))
});

router.post('/send', (req, res) => {
    const body = req.body
    if(!body.email || !body.first_name || !body.last_name) return res.json({
        success: false,
        message: 'Please fill all the details!'
    })

    const registerUser = (db)=>{
        const newUser = new User(body)
        newUser.save().then(response=>{
            console.log(response)
            res.json({
                success: true,
                message: 'Subscribed'
            })
            db.disconnect()
        }).catch(err=>{
            console.log(err.message)
            if(err.message.includes("duplicate key")){
                res.json({
                    success: false,
                    message: 'Email already registered!'
                })
            }else{
                res.json({
                    success: false,
                    message: 'Something went wrong!'
                })
            }
            db.disconnect()
        })
    }

    connection.connect(registerUser)
})

router.get('/subscribed', (req, res)=>{
    res.sendFile(path.join(__dirname, '..', 'pages', 'subscribed.html'))
});


module.exports = router;