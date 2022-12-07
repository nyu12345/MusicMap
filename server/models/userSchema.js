const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  name: { type: String },
  spotifyUsername: { type: String },
  numFriends: { type: Number },
  profilePic: { type: String },
  friends: [{ type: Schema.Types.ObjectId, ref: "User", optional: true }],
  roadtrips: [{ type: Schema.Types.ObjectId, ref: "Roadtrip", optional: true }],
  notificationToken: {type: String},
});

// generate createdAt & updatedAt fields
userSchema.set("timestamps", true);

module.exports = mongoose.model("User", userSchema);
