const mongoose = require('mongoose');
let db;

const connectToDb = (callback) =>{
    mongoose.connect('mongodb://localhost:27017/subscription', {useNewUrlParser: true}).then((dbConnection)=>{
        db = dbConnection;
        afterwards(callback);
    });
}

function afterwards(callback){

    callback(db)

    // db.disconnect();
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