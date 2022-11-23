const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const friendRequestSchema = new mongoose.Schema({
  requestorId: { type: Schema.Types.ObjectId, ref: "User", optional: true },
  requestedId: { type: Schema.Types.ObjectId, ref: "User", optional: true },
});

// generate createdAt & updatedAt fields
friendRequestSchema.set("timestamps", true);

module.exports = mongoose.model("FriendRequest", friendRequestSchema);
