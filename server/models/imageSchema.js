const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  tripId: { type: String, required: true },
  imageURL: { type: String, required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    name: { type: String, required: true },
  },
  datestamp: { type: String, required: true },
});

module.exports = mongoose.model("Image", imageSchema);
