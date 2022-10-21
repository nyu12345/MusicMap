const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    name: { type: String }, 
    spotifyUsername: { type: String }, 
    //friends: [{ type: Schema.Types.ObjectId, ref: 'User'}], 
});

// generate createdAt & updatedAt fields
userSchema.set('timestamps', true); 

module.exports = mongoose.model("User", userSchema);