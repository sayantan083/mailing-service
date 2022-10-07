const cron = require('node-cron');
const User = require('../models/userModel');
const connection = require("../database");
const {sendMail} = require('./sendMail');
const axios = require('axios');

const task = cron.schedule('30 18 * * *', () => {

    const sendJoke = ()=>{
        User.find({isSubscribed:true}).then(response=>{

            const allEmails = response.map(user=>{
                return user.email
            })
            console.log(allEmails)
            if(!allEmails.length) return;
            const options = {
                url: 'https://dad-jokes.p.rapidapi.com/random/joke',
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': process.env.API_KEY,
                    'X-RapidAPI-Host': 'dad-jokes.p.rapidapi.com'
                }
            };
            axios(options)
            .then(response=>{
                let indianDate = new Date().toLocaleString("en-Us", {timeZone: 'Asia/Kolkata'});
                if(response.data.success){
                allEmails.forEach(email=>{
                    const payload = {
                        emails: email,
                        subject: "Brought you some humour",
                        emailTemplate: `<div>
                        <h4>Hey there! Here is your daily digest of dad jokes😉</h4>
                        <p>${response.data.body[0].setup}</p>
                        <p>${response.data.body[0].punchline}</p>
                        <p><a href="https://joke-subscription.herokuapp.com/unsubscribe/${email}">Click here</a> to unsubscribe.</p>
                      </div>`
                    }
                    sendMail(payload)
                    console.log('Sent mail at ' + indianDate);
                })
                }else {
                    console.log('Joke api failure ' + indianDate);
                }
            })
            .catch(err => console.error(err));
        }).catch(err=>{
            console.log(err)
            res.json({
                success: false,
                message: 'Something went wrong!'
            })
        })
    }

    connection.connect(sendJoke)

}, {
  scheduled: true,
  timezone: "Asia/Kolkata"
});

module.exports = task;
