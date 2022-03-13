const { ApolloServer } = require('apollo-server');
const Resolver = require('./graphql/resolvers')
const TypeDefs = require('./graphql/typeDefs')
const connectDB = require('./config/db')
const Is_Auth = require('./Middleware/auth')

connectDB()

const resolvers = Resolver
const typeDefs = TypeDefs

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: Is_Auth,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});