const mongoose = require('mongoose');
let db;

const connectToDb = (callback) =>{
    mongoose.connect('mongodb+srv://node-app:'+process.env.DB_PASSWORD+'@cluster0.x0hr6oa.mongodb.net/subscription', {useNewUrlParser: true}).then((dbConnection)=>{
        db = dbConnection;
        afterwards(callback);
    });
}

const afterwards = (callback) =>{
    callback(db)
}

const conn = mongoose.connection;
conn.on('connected', function() {
    console.log('database is connected successfully');
});
conn.on('disconnected',function(){
    console.log('database is disconnected successfully');
})
conn.on('error', console.error.bind(console, 'connection error:'));
module.exports = {
    connect: connectToDb
}