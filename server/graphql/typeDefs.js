const {gql} = require('apollo-server')

module.exports= gql`
type User {
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
        
}  
`
