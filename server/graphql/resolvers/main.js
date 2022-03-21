const userResolver = require("./users");
const messageResolver = require("./messages");
const Message = require("../../models/message");
const User = require("../../models/user");

module.exports = {
  Message: {
    createdAt: (parent) => parent.createdAt.toISOString(),
  },
  User: {
    createdAt: (parent) => parent.createdAt.toISOString(),
  },
  Reaction: {
    createdAt: (parent) => parent.createdAt.toISOString(),
    message: async (parent) => await Message.findById(parent.messageId),
    user: async (parent) =>
      await User.findById(parent.userId).select("username createdAt"),
  },
  Query: {
    ...userResolver.Query,
    ...messageResolver.Query,
  },
  Mutation: {
    ...userResolver.Mutation,
    ...messageResolver.Mutation,
  },
  Subscription: {
    ...messageResolver.Subscription,
  },
};
