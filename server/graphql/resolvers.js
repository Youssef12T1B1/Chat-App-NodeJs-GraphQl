const User = require('../models/user')
const Message = require('../models/message')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const jwtSecret = require('../config/.env').Jwt_Sec
const { UserInputError, AuthenticationError} = require('apollo-server')
const { FromStuff }= require('./form')
const { create } = require('../models/message')
module.exports ={
    Query: {
        getUser:  async (parent,args, { user })=> {
         
          try {
            if(!user) throw new AuthenticationError('Authetication Failed')
          
              const users = await User.find({username : {$ne : user.username}})
              return users.map( user =>{
                    return  FromStuff(user)
                  })

              
          }catch(err){
            console.log(err);
            throw err
          }
            
        },
        login : async (parent, args)=>{
            let {username, password} = args
            let errors = {}
            try{
                if(username.trim() === '') errors.username = 'Username must not be Empty'
                if(password === '') errors.password = 'Password must not be Empty'
                if(Object.keys(errors).length>0){
                    throw new UserInputError('Found',{errors})
                }
                let user = await User.findOne({
                    username
                })
                if(!user){
                     errors.username = 'User not Found'
                     throw new UserInputError('not Found',{errors})
                     
                }
            

                const hashPassword = await bcrypt.compare(password,user.password)
                if(!hashPassword){
                    errors.password = 'Password is incorrect'
                    
                    throw new AuthenticationError('pass',{errors})
                }

                const token =  jwt.sign({
                   username
                  }, jwtSecret, { expiresIn: '1h' });


               
                return {
                    ...user.toJSON(),
                    createdAt : new Date(user.createdAt).toISOString(),
                    token : token
                }
            }
            catch (err){
                  console.log(err);
                  throw err
            }
        }
    },
    Mutation:{
        addUser: async  (parent, args) => {
            let {username, email, password,confirmPassword} = args
            let errors = {}
            

           
            try{
                if(username.trim() === '') errors.username = 'Username must not be Empty'
                if(email.trim()  === '') errors.email = 'E-mail must not be Empty'
                if(password.trim() === '') errors.password = 'Password must not be Empty'
                 if(confirmPassword.trim() === '') errors.confirmPassword = 'Please repeat the Same Password'
                 if(confirmPassword !== password) errors.confirmPassword = 'Passwords must match'
               
                // const userUsername = await User.findOne({username})
                // const userEmail = await User.findOne({email})
                // if(userUsername) errors.username = "Username is taken"
                // if(userEmail) errors.email = "E-mail is taken"

                if(Object.keys(errors).length>0){
                    throw errors
                } 
               
                password = await bcrypt.hash(password, 12)
              

                const user =  await User.create({
                    username, email, password
                })
                return user 

            }catch(err){
          
             if(err.code === 11000 && err.keyValue.username ) err.username = 'that username is already used'
             if(err.code === 11000 && err.keyValue.email ) err.email = 'that Email is already used'
             if(err.name === 'ValidationError') err.email = 'Please Entre a valide Email'
                
                throw new UserInputError('Err', {errors : err})
            }


        },
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

        }
    }

}
    

