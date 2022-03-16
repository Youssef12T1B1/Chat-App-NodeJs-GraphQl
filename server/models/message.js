const mongoose = require('mongoose')
const messageSchema = new mongoose.Schema({
 
    body: {
            type: String,  
            
    },
    receiver:{
        type: String 
    },
    sender:{
        type: String 
    },
    reactions:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'reaction'
    }]



},{timestamps:true})
 const Message = mongoose.model('message',messageSchema)
module.exports = Message