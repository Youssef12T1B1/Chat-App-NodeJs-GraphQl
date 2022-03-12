const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const jwtSecret = require('../config/.env').Jwt_Sec
const { UserInputError, AuthenticationError} = require('apollo-server')
module.exports ={
    Query: {
        getUser:  async (parent,args, context)=> {
         
          try {
            let user
            if(context.req && context.req.headers.authorization){
                const token = context.req.headers.authorization.split(' ')[1]
                jwt.verify(token, jwtSecret, (err, decodedToken)=>{
                    if(err){
                        throw new AuthenticationError('Authetication Failed')
                    }
                    user = decodedToken
                   
                })
            }
              const users = await User.find()
              return users
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
             
             console.log(err);
          
                if(err.keyPattern.username === 1) err.username = err.keyValue.username +' is Already taken'
                if(err.keyPattern.email === 1) err.email = err.keyValue.email +' is Already taken'
                if(err.name === 'ValidationError' ) err.email = err.errors.email.message

              
                throw new UserInputError('Err', {errors: err})
            }


        }
    }

}
    

