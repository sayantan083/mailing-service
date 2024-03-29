const express = require('express');
const router = express.Router();
const path = require('path')
const User = require('../models/userModel');
const connection = require("../database");
const {sendMail} = require("../helpers/sendMail");

router.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, '..', 'pages', 'home.html'))
});

router.post('/send', (req, res) => {
    const body = req.body
    if(!body.email || !body.first_name || !body.last_name) return res.json({
        success: false,
        message: 'Please fill all the details!'
    })

    const registerUser = ()=>{

        const newUser = new User(body)
        newUser.save().then(response=>{
            console.log(response)
            const payload = {
                emails: body.email,
                subject: "Subscription Confirmation",
                emailTemplate: `<div>
                <h4>Hey there! Welcome to the club😊</h4>
                <p>This to confirm that you have been subscribed to our joke mailing service. You will receive a joke at 6:30 in the evening everyday.</p>
                <p><a href="https://joke-subscription.herokuapp.com/unsubscribe/${body.email}">Click here</a> to unsubscribe.</p>
              </div>`
            }
            sendMail(payload)
            res.json({
                success: true,
                message: 'Subscribed'
            })
        }).catch(err=>{
            console.log(err.message)
            if(err.message.includes("duplicate key")){
                User.find({email:body.email,isSubscribed:false})
                .then(response=>{
                    console.log(response.length)
                    if(response.length){
                        User.updateOne({email: body.email},{isSubscribed:true})
                        .then(response=>{
                            res.json({
                                success: true,
                                message: 'Subscribed'
                            })
                        })
                        .catch(error=>{
                            console.log(error)
                        })
                    }else{
                        res.json({
                            success: false,
                            message: 'Email already registered!'
                        })
                    }
                })
                .catch(error=>{
                    console.log(error)
                    res.json({
                        success: false,
                        message: 'Something went wrong!'
                    })
                })
            }else{
                res.json({
                    success: false,
                    message: 'Something went wrong!'
                })
            }
        })
    }

    connection.connect(registerUser)
})

router.get('/subscribed', (req, res)=>{
    res.sendFile(path.join(__dirname, '..', 'pages', 'subscribed.html'))
});

router.get('/unsubscribe/:email', (req, res)=>{

    const email = req.params.email;

    const unsubscribeUser = ()=>{

        User.findOneAndUpdate({email:email},{isSubscribed:false}).then(response=>{
            console.log(response)
            res.sendFile(path.join(__dirname, '..', 'pages', 'unsubscribed.html'))
        }).catch(err=>{
            res.sendFile(path.join(__dirname, '..', 'pages', 'error.html'))
        })
    }

    connection.connect(unsubscribeUser)
});

module.exports = router;