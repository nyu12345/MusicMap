const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
    tripId: { type: String, required: true },
    imageURL: { type: String, required: true },
    location: {
        latitude: { type: Number },
        longitude: { type: Number },
        name: { type: String },
    },
    datestamp: { type: String }
});


module.exports = mongoose.model("Image", imageSchema);