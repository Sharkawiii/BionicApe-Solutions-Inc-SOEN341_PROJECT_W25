// Filename - model/User.js

const mongoose = require('mongoose')
const Schema = mongoose.Schema

var User = new Schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    role:{
        type:String
    },
    channels: {
        type:[String]
    }
})

//remove password when transforming to JSON. Don't want to send back to clients with password
User.method.toJSON= function(){
    var obj=this.toObject();
    delete obj.password;
    delete obj._id;
    return obj;

}
module.exports = mongoose.model('User', User)
