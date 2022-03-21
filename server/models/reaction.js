const mongoose = require("mongoose");
const reactionSchema = new mongoose.Schema(
  {
    content: {
      type: String,
    },
    messageId: String,
    userId: String,
  },
  { timestamps: true }
);
const Reaction = mongoose.model("reaction", reactionSchema);
module.exports = Reaction;
