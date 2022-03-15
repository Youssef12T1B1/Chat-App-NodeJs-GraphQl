const mongoose = require('mongoose')
const reactionSchema = new mongoose.Schema({
 
    content: {
            type: String,  
    },
    messageId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'message'
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }


},{timestamps:true})
 const Reaction = mongoose.model('reaction',reactionSchema)
module.exports = Reaction