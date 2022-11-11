const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
<<<<<<< HEAD
  name: { type: String },
  spotifyUsername: { type: String },
  numFriends: { type: Number },
  profilePic: { type: String },
  friends: [{ type: Schema.Types.ObjectId, ref: "User", optional: true }],
=======
    name: { type: String }, 
    spotifyUsername: { type: String }, 
    numFriends: { type: Number }, 
    profilePic: { type: String }, 
    friends: [{ type: Schema.Types.ObjectId, ref: 'User', optional: true}], 
>>>>>>> 283924309b7e4ea67aa62c9c8c665954dfaba92a
});

// generate createdAt & updatedAt fields
userSchema.set("timestamps", true);

module.exports = mongoose.model("User", userSchema);
