const mongoose = require('mongoose')
const { isEmail } = require('validator');
const userSchema = new mongoose.Schema({
 
    username: { type: String,  unique: true},
    email: { type: String, unique: true,
    validate: [isEmail , 'Please Entre a valide Email']
    },
    password: { type: String}



},{timestamps:true})
 const User = mongoose.model('user',userSchema)
module.exports = User