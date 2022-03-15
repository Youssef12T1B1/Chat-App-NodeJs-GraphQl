const User = require('../../models/user')
const Message = require('../../models/message')
const Reaction = require('../../models/reaction')

const { UserInputError, AuthenticationError, ForbiddenError} = require('apollo-server')


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

             
                return message


            } catch (err) {
                console.log(err);
                throw err
            }

        },
        reactMsg: async(_, {id, content}, {user}) =>{
            const reactions = ['❤️', '😆', '😯', '😢', '😡', '👍', '👎']
          try {
              if(!reactions.includes(content)) {
                  throw new UserInputError('Invalid Reaction')
              }

              const username = user? user.username : ''
              user = await User.findOne({username})
              if(!user) throw new AuthenticationError('Authentication Failed')

              const message =  await Message.findOne({_id:id})
              if(!message) throw new UserInputError('No msg')

              if(message.sender !== user.username && message.receiver !== user.username ){
                   throw new ForbiddenError('Unauthorized')
              }

              let reaction = await Reaction.findOne( {messageId: message._id , userId: user._id })
               
              if(reaction){
                  reaction.content = content
                  await reaction.save()

              }else{
                  reaction =  await Reaction.create({
                    messageId:message._id,
                    userId:user._id,
                    content
                  })
              }
              return reaction

          } catch (err) {
              console.log(err);
          }
        }
    },



}
    

