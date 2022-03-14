const mongoose = require('mongoose')
const { isEmail } = require('validator');
const userSchema = new mongoose.Schema({
 
    username: { type: String, 
     unique: [true, 'That username is taken.']},
    email: { type: String, unique: [true, 'That Email is taken.'],
    validate: [isEmail , 'Please Entre a valide Email']
    },
    password: { type: String,
        minLength: [6, 'Password should be at least Six characters']
    },




},{timestamps:true})
 const User = mongoose.model('user',userSchema)
module.exports = User