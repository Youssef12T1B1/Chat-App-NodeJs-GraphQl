const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { createServer } = require("http");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { SubscriptionServer } = require("subscriptions-transport-ws");
const { execute, subscribe } = require("graphql");
const Resolver = require("./graphql/resolvers/main");
const TypeDefs = require("./graphql/typeDefs");
const connectDB = require("./config/db");
const Is_Auth = require("./Middleware/auth");

connectDB();

const resolvers = Resolver;
const typeDefs = TypeDefs;

(async function () {
  const app = express();
  const httpSrever = createServer(app);

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });
  const subscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
    },
    {
      server: httpSrever,
      path: "/graphql",
    }
  );

  const server = new ApolloServer({
    schema,
    plugins: [
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            },
          };
        },
      },
    ],
    context: Is_Auth,
  });
  await server.start();
  server.applyMiddleware({ app });

  httpSrever.listen({ port: 4000 }, () => {
    console.log("🚀 Server ready at 4000");
  });
})();
