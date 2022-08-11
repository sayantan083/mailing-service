const cron = require('node-cron');
const User = require('../models/userModel');
const connection = require("../database");
const {sendMail} = require('./sendMail');
const axios = require('axios');

const task = cron.schedule('30 8 * * *', () => {

    const registerUser = (db)=>{
        User.find({isSubscribed:true}).then(response=>{

            const allEmails = response.map(user=>{
                return user.email
            })
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
                console.log(response.data)
                if(response.data.success){
                    const payload = {
                        emails: allEmails,
                        setup: response.data.body[0].setup,
                        punchline: response.data.body[0].punchline
                    }
                    console.log(payload)
                    sendMail(payload)
                    console.log('Sent mail at ' + indianDate);
                }else {
                    console.log('Joke api failure ' + indianDate);
                }
                db.disconnect()
            })
            .catch(err => console.error(err));
        }).catch(err=>{
            console.log(err)
            res.json({
                success: false,
                message: 'Something went wrong!'
            })
            db.disconnect()
        })
    }

    connection.connect(registerUser)

}, {
  scheduled: true,
  timezone: "Asia/Kolkata"
});

module.exports = task;
