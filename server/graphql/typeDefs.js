const {gql} = require('apollo-server')

module.exports= gql`
type User {
  _id : String!
    username:String!
    email:String
    token : String
    createdAt : String!
    latestMessage : Message

}
type Message {
  _id:ID!
  body:String!
  sender: String!
  receiver:String!
  createdAt : String!
  reactions: [Reaction]

}
type Reaction{
  _id:ID!
  content:String!
  message: Message!
  user:User!
  createdAt : String!
}
  type Query {
    getUser: [User]!
    login (username:String!, password:String!): User!
    getMessage(sender: String!): [Message]!
  }
type Mutation{
    addUser(
        username:String!, email: String!,
         password:String!,
        confirmPassword: String!): User!
    sendMessage(
      receiver:String!,
      body:String!
    )  : Message!  
    reactMsg(id:ID!, content:String!): Reaction!
        
}  
 type Subscription{
   newMessage: Message!
 }


`
