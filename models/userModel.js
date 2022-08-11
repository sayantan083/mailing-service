const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {type:String, unique:true},
    isSubscribed: {type: Boolean, default: true}
})

const User = mongoose.model("User", UserSchema)

module.exports = User;