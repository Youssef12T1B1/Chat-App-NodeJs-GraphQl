const User = require('../../models/user')
const Message = require('../../models/message')

const { UserInputError, AuthenticationError} = require('apollo-server')

// const pubsub = new PubSub()
module.exports ={
    Query:{
        getMessage : async (parent, {sender}, {user})=>{
            try {
                if(!user) throw new AuthenticationError('Authetication Failed')
                const msgUser = await User.findOne({username: sender})
                if(!msgUser) throw new UserInputError('User Not Found')
                
                const usernames = [user.username, msgUser.username]
                const messages = await Message.find(
                    {
                    receiver:{  $in: usernames },
                    sender:{  $in: usernames }

                }
                ).sort({'createdAt': -1})

               return messages
            } catch (err) {
                console.log(err);
                throw err
            }

        }
    },


    Mutation:{
      
        sendMessage: async (parent, {receiver, body}, {user})=>{
            try {
                if(!user) throw new AuthenticationError('Authetication Failed')

                const receiverTest = await User.findOne({username: receiver})
                if(!receiverTest){
                    throw new UserInputError('User not Found')
                }
                else if(receiverTest.username === user.username){
                    throw new UserInputError('No Messages to Yourself dude')
                }
                if(body.trim()=== '') throw new UserInputError('Message is Empty')

                const message = await  Message.create({
                    sender: user.username,
                    receiver,
                    body
                })

                // pubsub.publish('NewMessage', {newMessage: message})
                return message


            } catch (err) {
                console.log(err);
                throw err
            }

        }
    },

    Subscription:{
        newMessage:()=> pubsub.asyncIterator(['NewMessage'])
    }

}
    

