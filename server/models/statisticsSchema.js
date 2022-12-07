const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    spotifyUsername: { type: String, required: true }, 
    numTrips: { type: Number, required: true }, 
    //friends: [{ type: Schema.Types.ObjectId, ref: 'User'}], 
});

// generate createdAt & updatedAt fields
userSchema.set('timestamps', true); 

module.exports = mongoose.model("Statistics", userSchema);